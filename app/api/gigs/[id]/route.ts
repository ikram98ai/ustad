import authOptions from "@/app/auth/authOptions";
import { patchGigSchema } from "@/app/validationSchemas";
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

  const validation = patchGigSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, {
      status: 400,
    });

  const gig = await prisma.gig.findUnique({
    where: { id: (await params).id },
  });
  if (!gig) return NextResponse.json({ error: "Invalid gig" }, { status: 404 });

  const updatedGig = await prisma.gig.update({
    where: { id: gig.id },
    data: {
      title: body.title,
      rate: parseFloat(body.rate),
      range: parseFloat(body.range),
      professionId: body.professionId,
      description: body.description,
      latitude: body.latitude === undefined ? undefined : body.latitude,
      longitude: body.longitude === undefined ? undefined : body.longitude,
      address: body.address === undefined ? undefined : body.address || null,
    },
  });

  return NextResponse.json(updatedGig);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const gig = await prisma.gig.findUnique({
    where: { id: (await params).id },
  });

  if (!gig) return NextResponse.json({ error: "Invalid gig" }, { status: 404 });

  await prisma.gig.delete({
    where: { id: gig.id },
  });

  return NextResponse.json({});
}
