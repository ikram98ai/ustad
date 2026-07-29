import React from "react";
import PageContainer from "@/app/components/PageContainer";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import GigForm from "@/app/gigs/_components/GigFormLazy";

interface Props {
  params: Promise<{ id: string }>;
}

const EditGigPage = async ({ params }: Props) => {
  const { id } = await params;
  const gig = await prisma.gig.findUnique({
    where: { id },
  });

  if (!gig) notFound();

  const professions = await prisma.profession.findMany();
  return (
    <PageContainer>
      <GigForm gig={gig} professions={professions} />
    </PageContainer>
  );
};

export default EditGigPage;
