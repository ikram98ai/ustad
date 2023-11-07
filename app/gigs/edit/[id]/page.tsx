import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import GigFormSkeleton from "./loading";

const GigForm = dynamic(() => import("@/app/gigs/_components/GigForm"), {
  ssr: false,
  loading: () => <GigFormSkeleton />,
});

interface Props {
  params: { id: string };
}

const EditGigPage = async ({ params }: Props) => {
  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
  });

  if (!gig) notFound();

  const professions = await prisma.profession.findMany();
  return <GigForm gig={gig} professions={professions} />;
};

export default EditGigPage;
