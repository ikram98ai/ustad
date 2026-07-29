import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import GigOrder from "@/app/gigs/_components/GigOrder";
import ChatButton from "./ChatButton";
import EditGigButton from "./EditGigButton";
import GigDetails from "./GigDetails";
import DeleteGigButton from "./DeleteGigButton";
import { getServerSession } from "next-auth";
import { cache } from "react";
import authOptions from "@/app/auth/authOptions";

interface Props {
  params: Promise<{ id: string }>;
}

const fetchGig = cache((gigId: string) =>
  prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      profession: { select: { title: true } },
      user: { select: { name: true, image: true } },
    },
  })
);

const GigDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const { id } = await params;
  const gig = await fetchGig(id);

  if (!gig) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <GigDetails gig={gig} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            {session.user.id === gig.userId ? (
              <>
                <EditGigButton gigId={gig.id} />
                <DeleteGigButton gigId={gig.id} />
              </>
            ) : (
              <>
                <GigOrder gigId={gig.id} />
                <ChatButton receiverId={gig.userId} />
              </>
            )}
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const gig = await fetchGig(id);

  return {
    title: gig?.title,
    description: "Details of gig " + gig?.id,
  };
}

export default GigDetailPage;
