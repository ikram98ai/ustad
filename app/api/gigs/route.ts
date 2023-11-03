import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { gigSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = gigSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  const newGig = await prisma.gig.create({
    data: {
      title: body.title,
      rate: parseFloat(body.rate),
      range: parseFloat(body.range),
      profession: body.profession,
      description: body.description,
    },
  });
  return NextResponse.json(newGig, { status: 200 });
}
