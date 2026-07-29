import authOptions from "@/app/auth/authOptions";
import { notify } from "@/app/lib/notifications";
import { patchOrderSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  
  const body = await request.json();
  const validation = patchOrderSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, {
      status: 400,
    });

  const order = await prisma.order.findUnique({
    where: { id: (await params).id },
    include: { gigUser: true },
  });
  if (!order)
    return NextResponse.json({ error: "Invalid order" }, { status: 404 });

  const userId = session.user.id;
  const isCustomer = order.userId === userId;
  const isOwner = order.gigUser.userId === userId;
  if (!isCustomer && !isOwner)
    return NextResponse.json(
      { error: "You are not part of this order." },
      { status: 403 }
    );

  if (body.status) {
    // Customers can cancel, gig owners accept/reject (both while pending);
    // either side can complete an accepted order.
    const allowedTransitions: Record<string, boolean> = {
      CANCELLED: isCustomer && order.status === "PENDING",
      ACCEPTED: isOwner && order.status === "PENDING",
      REJECTED: isOwner && order.status === "PENDING",
      COMPLETED: order.status === "ACCEPTED",
    };
    if (!allowedTransitions[body.status])
      return NextResponse.json(
        { error: "This status change is not allowed." },
        { status: 403 }
      );
  }

  // The offer itself (rate, requirements, job type) belongs to the customer
  // and is only editable while the order is pending.
  if (
    (body.rate || body.requirements || body.job_type) &&
    (!isCustomer || order.status !== "PENDING")
  )
    return NextResponse.json(
      { error: "Only the customer can edit a pending offer." },
      { status: 403 }
    );

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      rate: body.rate ? parseFloat(body.rate) : order.rate,
      status: body.status || order.status,
      job_type: body.job_type || order.job_type,
      requirements: body.requirements || order.requirements,
    },
  });

  if (body.status && body.status !== order.status) {
    // Notify whichever party didn't make the change: the gig owner acting on
    // an order notifies the customer, and vice versa.
    const gigOwnerId = order.gigUser.userId;
    const recipientId =
      session.user.id === order.userId ? gigOwnerId : order.userId;
    await notify(recipientId, {
      type: "ORDER",
      title: `Order ${updatedOrder.status.toLowerCase()}`,
      body: `Your order on "${order.gigUser.title}" is now ${updatedOrder.status}.`,
      link: `/orders/${order.id}`,
    });
  }

  return NextResponse.json(updatedOrder);
}
