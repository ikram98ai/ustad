import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OrderStatus } from "@prisma/client";
import OrderActions from "./OrderActions";
import OrderTable, { IssueQuery, columnNames } from "./OrderTable";
import { Flex, Text } from "@radix-ui/themes";
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

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const orderCount = await prisma.order.count({ where });
  if (orders.length < 1) return <h2 className="text-xl font-medium text-center">There is no Orders</h2>;

  return (
    <Flex direction="column" gap="3">
      <OrderActions />
      <OrderTable searchParams={searchParams} orders={orders} />
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
