import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditGigButton from "./EditGigButton";
import GigDetails from "./GigDetails";
import DeleteGigButton from "./DeleteGigButton";
import { getServerSession } from "next-auth";
import { cache } from "react";
import authOptions from "@/app/auth/authOptions";

interface Props {
  params: { id: string };
}

const fetchUser = cache((gigId: number) =>
  prisma.gig.findUnique({ where: { id: gigId } })
);

const GigDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const gig = await fetchUser(parseInt(params.id));

  if (!gig) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <GigDetails gig={gig} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <EditGigButton gigId={gig.id} />
            <DeleteGigButton gigId={gig.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const gig = await fetchUser(parseInt(params.id));

  return {
    title: gig?.title,
    description: "Details of gig " + gig?.id,
  };
}

export default GigDetailPage;
