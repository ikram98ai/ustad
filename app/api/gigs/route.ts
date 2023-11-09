import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { gigSchema } from "@/app/validationSchemas";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = gigSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
  });
  const newGig = await prisma.gig.create({
    data: {
      title: body.title,
      rate: parseFloat(body.rate),
      range: parseFloat(body.range),
      professionId: parseInt(body.profession),
      description: body.description,
      userId: user!.id,
    },
  });
  return NextResponse.json(newGig, { status: 200 });
}
