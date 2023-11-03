import React from 'react'
import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic';
import GigFormSkeleton from './loading';

const GigForm = dynamic(
  () => import('@/app/gigs/_components/GigForm'),
  { 
    ssr: false, 
    loading: () => <GigFormSkeleton />
  }
)

interface Props {
  params: { id: string }
}

const EditGigPage = async ({ params }: Props) => {
  const gig = await prisma.gig.findUnique({
    where: { id: parseInt(params.id)}
  });

  if (!gig) notFound();

  return (
    <GigForm gig={gig} />
  )
}

export default EditGigPage