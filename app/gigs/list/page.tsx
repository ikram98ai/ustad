import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import {AvailabilityStatus as Status } from "@prisma/client";
import GigActions from "./GigActions";
import GigTable, { gigQuery, columnNames } from "./GigTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: gigQuery;
}

const gigsPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const where = { status };

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const gigs = await prisma.gig.findMany({
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const gigCount = await prisma.gig.count();

  return (
    <Flex direction="column" gap="3">
      <GigActions />
      <GigTable searchParams={searchParams} gigs={gigs} />
      <Pagination pageSize={pageSize} currentPage={page} itemCount={gigCount} />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "gig Tracker - gig List",
  description: "View all project gigs",
};

export default gigsPage;
