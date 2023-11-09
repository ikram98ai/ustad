import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import GigActions from "./GigActions";
import GigCardList from "./GigCardList";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { Gig } from "@prisma/client";

export interface gigQuery {
  profession: string | undefined;
  orderBy: keyof Gig;
  page: string;
}

interface Props {
  searchParams: gigQuery;
}

const Home = async ({ searchParams }: Props) => {
  const profession = searchParams.profession
    ? await prisma.profession.findUnique({
        where: { title: searchParams.profession },
        select: { id: true },
      })
    : undefined;

  const where = { is_active: true, professionId: profession?.id };

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 40;

  const gigs = await prisma.gig.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const gigCount = await prisma.gig.count({ where });

  return (
    <Flex direction="column" gap="3">
      <GigActions />
      <GigCardList gigs={gigs} />
      <Pagination pageSize={pageSize} currentPage={page} itemCount={gigCount} />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "gig Tracker - gig List",
  description: "View all project gigs",
};

export default Home;
