import dynamic from "next/dynamic";
import GigFormSkeleton from "./loading";
import prisma from "@/prisma/client";

const GigForm = dynamic(() => import("@/app/gigs/_components/GigForm"), {
  ssr: false,
  loading: () => <GigFormSkeleton />,
});

const NewgigPage = async () => {
  const professions = await prisma.profession.findMany()
  return <GigForm professions={professions} />;
};

export default NewgigPage;
