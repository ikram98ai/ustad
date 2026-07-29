import PageContainer from "@/app/components/PageContainer";
import prisma from "@/prisma/client";
import GigForm from "@/app/gigs/_components/GigFormLazy";

const NewgigPage = async () => {
  const professions = await prisma.profession.findMany()
  return (
    <PageContainer>
      <GigForm professions={professions} />
    </PageContainer>
  );
};

export default NewgigPage;
