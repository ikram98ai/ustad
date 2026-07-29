import prisma from "@/prisma/client";
import { Metadata } from "next";
import Explore from "./components/explore/Explore";

const GigsHome = async () => {
  // Gigs themselves load client-side for just the visible map area — the
  // initial view only fetches pros near the user (see Explore).
  const professions = await prisma.profession.findMany({
    orderBy: { title: "asc" },
  });

  return <Explore professions={professions} />;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find an Ustad",
  description:
    "Find skilled local pros on the map — search, filter and hire the perfect match near you.",
};

export default GigsHome;
