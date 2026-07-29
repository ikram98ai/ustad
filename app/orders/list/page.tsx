import authOptions from "@/app/auth/authOptions";
import PageContainer from "@/app/components/PageContainer";
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OrderStatus } from "@/prisma/models";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaClipboardList } from "react-icons/fa6";
import Link from "next/link";
import OrderActions from "./OrderActions";
import OrderTable, { OrderQuery } from "./OrderTable";
import OrderTypeTabs from "./OrderTypeTabs";

interface Props {
  searchParams: Promise<OrderQuery>;
}

const OrdersPage = async (props: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/orders/list");
  const userId = session.user.id;

  const searchParams = await props.searchParams;
  const type = searchParams.type === "received" ? "received" : "placed";

  const statuses = Object.values(OrderStatus);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  // "placed" = offers this user made; "received" = orders on this user's gigs.
  const where =
    type === "received"
      ? { status, gigUser: { userId } }
      : { status, userId };

  const orderBy = { startedAt: "desc" } as const;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true } },
      gigUser: { select: { title: true, user: { select: { name: true } } } },
    },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const orderCount = await prisma.order.count({ where });

  return (
    <PageContainer className="max-w-3xl">
      <Flex direction="column" gap="3">
        <div>
          <h1 className="mb-1">Orders</h1>
          <p className="text-sm text-gray-500">
            Offers you’ve placed and work coming into your gigs.
          </p>
        </div>
        <OrderTypeTabs searchParams={searchParams} active={type} />
        <OrderActions />
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <FaClipboardList size={36} className="text-gray-300" />
            <p className="font-semibold">
              {type === "received"
                ? "No orders received yet"
                : "No orders placed yet"}
            </p>
            <p className="max-w-xs text-sm text-gray-500">
              {type === "received"
                ? "Orders customers place on your gigs will show up here."
                : "Find an ustad on the map and place your first order."}
            </p>
            <Link
              href={type === "received" ? "/gigs/new" : "/"}
              className="mt-1 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              {type === "received" ? "Create a gig" : "Explore ustads"}
            </Link>
          </div>
        ) : (
          <>
            <OrderTable searchParams={searchParams} orders={orders} type={type} />
            <Pagination
              pageSize={pageSize}
              currentPage={page}
              itemCount={orderCount}
            />
          </>
        )}
      </Flex>
    </PageContainer>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders you placed and orders received on your gigs",
};

export default OrdersPage;
