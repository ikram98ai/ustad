import authOptions from "@/app/auth/authOptions";
import { patchOrderSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  
  const body = await request.json();
  const validation = patchOrderSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
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

  return NextResponse.json(updatedOrder);
}
