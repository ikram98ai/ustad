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
