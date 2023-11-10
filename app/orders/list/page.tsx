import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OrderStatus } from "@prisma/client";
import OrderActions from "./OrderActions";
import IssueTable, { IssueQuery, columnNames } from "./OrderTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(OrderStatus);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const where = { status };

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.order.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const orderCount = await prisma.order.count({ where });

  return (
    <Flex direction="column" gap="3">
      <OrderActions />
      <IssueTable searchParams={searchParams} orders={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={orderCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};

export default IssuesPage;
