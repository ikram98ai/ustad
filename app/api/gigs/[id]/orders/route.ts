import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { orderSchema } from "../../../../validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = orderSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newOrder = await prisma.order.create({
    data: { rate: body.rate, job_type: body.job_type },
  });

  return NextResponse.json(newOrder, { status: 201 });
}
