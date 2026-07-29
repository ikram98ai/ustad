import { signUpSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Native sign-up: creates a password-backed account. Google accounts are
// created by the NextAuth Prisma adapter instead.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = signUpSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, { status: 400 });

  const email = validation.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );

  const hashedPassword = await bcrypt.hash(validation.data.password, 12);
  const user = await prisma.user.create({ data: { email, hashedPassword } });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
