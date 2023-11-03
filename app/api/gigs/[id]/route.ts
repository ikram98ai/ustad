import { gigSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = "await getServerSession(authOptions);";
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = gigSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });

  const { title, rate, range, profession, description } = body;

  const gig = await prisma.gig.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!gig) return NextResponse.json({ error: "Invalid gig" }, { status: 404 });

  const updatedGig = await prisma.gig.update({
    where: { id: gig.id },
    data: {
      title,
      rate: parseFloat(body.rate),
      range: parseFloat(body.range),
      profession,
      description,
    },
  });

  return NextResponse.json(updatedGig);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = "await getServerSession(authOptions);";
  if (!session) return NextResponse.json({}, { status: 401 });

  const gig = await prisma.gig.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!gig) return NextResponse.json({ error: "Invalid gig" }, { status: 404 });

  await prisma.gig.delete({
    where: { id: gig.id },
  });

  return NextResponse.json({});
}
