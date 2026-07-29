import prisma from "@/prisma/client";
import GigForm from "@/app/gigs/_components/GigFormLazy";

const NewgigPage = async () => {
  const professions = await prisma.profession.findMany()
  return <GigForm professions={professions} />;
};

export default NewgigPage;
