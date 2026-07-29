import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { orderSchema } from "../../../../validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { notify } from "@/app/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = orderSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
  });

  const gig = await prisma.gig.findUnique({ where: { id: (await params).id } });
  if (!gig) return NextResponse.json({ error: "Invalid gig" }, { status: 404 });

  if (gig.userId === user!.id)
    return NextResponse.json(
      { error: "You cannot order your own gig." },
      { status: 400 }
    );

  const newOrder = await prisma.order.create({
    data: {
      rate: parseFloat(body.rate),
      job_type: body.job_type,
      requirements: body.requirements,
      gigId: (await params).id,
      userId: user!.id,
      endAt: null,
    },
  });

  await notify(gig.userId, {
    type: "ORDER",
    title: "New order request",
    body: `${user!.name ?? "A customer"} requested an order on "${
      gig.title
    }" at $${newOrder.rate} ${newOrder.job_type}.`,
    link: `/orders/${newOrder.id}`,
  });

  return NextResponse.json(newOrder, { status: 201 });
}
