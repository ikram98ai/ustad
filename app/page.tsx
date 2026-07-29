import prisma from "@/prisma/client";
import { Metadata } from "next";
import Explore from "./components/explore/Explore";

const GigsHome = async () => {
  const [professions, gigs] = await Promise.all([
    prisma.profession.findMany({ orderBy: { title: "asc" } }),
    prisma.gig.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
      take: 200,
      include: {
        user: { select: { name: true, image: true } },
        profession: { select: { title: true } },
      },
    }),
  ]);

  return <Explore professions={professions} initialGigs={gigs} />;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find an Ustad",
  description:
    "Find skilled local pros on the map — search, filter and hire the perfect match near you.",
};

export default GigsHome;
