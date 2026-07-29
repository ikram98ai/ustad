import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { gigSchema } from "@/app/validationSchemas";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { JobType, Prisma } from "@/prisma/models";

const MAX_RESULTS = 200;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const q = params.get("q")?.trim();
  const professionId = params.get("professionId") || undefined;
  const jobTypeParam = params.get("jobType") || undefined;
  const jobType = Object.values(JobType).includes(jobTypeParam as JobType)
    ? (jobTypeParam as JobType)
    : undefined;
  const maxRate = parseFloat(params.get("maxRate") || "");
  const sort = params.get("sort") || "recommended";

  // Viewport bounds: when present, only gigs inside the visible map area are
  // returned, so the client never loads the whole table.
  const north = parseFloat(params.get("north") || "");
  const south = parseFloat(params.get("south") || "");
  const east = parseFloat(params.get("east") || "");
  const west = parseFloat(params.get("west") || "");
  const hasBounds = ![north, south, east, west].some(Number.isNaN);

  const where: Prisma.GigWhereInput = {
    is_active: true,
    professionId,
    job_type: jobType,
    rate: Number.isNaN(maxRate) ? undefined : { lte: maxRate },
    latitude: hasBounds ? { gte: south, lte: north } : undefined,
    longitude: hasBounds ? { gte: west, lte: east } : undefined,
    OR: q
      ? [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { profession: { title: { contains: q, mode: "insensitive" } } },
          { user: { name: { contains: q, mode: "insensitive" } } },
        ]
      : undefined,
  };

  const orderBy: Prisma.GigOrderByWithRelationInput =
    sort === "price_asc"
      ? { rate: "asc" }
      : sort === "price_desc"
      ? { rate: "desc" }
      : { created_at: "desc" };

  const gigs = await prisma.gig.findMany({
    where,
    orderBy,
    take: MAX_RESULTS,
    include: {
      user: { select: { name: true, image: true } },
      profession: { select: { title: true } },
    },
  });

  return NextResponse.json(gigs);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = gigSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
  });
  const newGig = await prisma.gig.create({
    data: {
      title: body.title,
      rate: parseFloat(body.rate),
      range: parseFloat(body.range),
      professionId: body.professionId,
      description: body.description,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      address: body.address || null,
      userId: user!.id,
    },
  });
  return NextResponse.json(newGig, { status: 200 });
}
