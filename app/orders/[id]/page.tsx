import PageContainer from "@/app/components/PageContainer";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { cache } from "react";
import OrderDetails from "./OrderDetails";
import ChangeOrderStatusButton from "./ChangeOrderStatusButton";
import { OrderStatus } from "@/prisma/models";
import ChatButton from "@/app/gigs/[id]/ChatButton";
import EditOrder from "../_components/EditOrder";

interface Props {
  params: Promise<{ id: string }>;
}

const fetchOrder = cache((orderId: string) =>
  prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, image: true } },
      gigUser: {
        select: {
          userId: true,
          title: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
  })
);

const helperText = (
  status: OrderStatus,
  role: "customer" | "ustad"
): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return role === "customer"
        ? "Waiting for the ustad to respond. You can update your offer or cancel it."
        : "New request — accept to start working, or reject if it doesn’t fit.";
    case OrderStatus.ACCEPTED:
      return "Work is in progress. Mark it completed once both sides agree.";
    case OrderStatus.COMPLETED:
      return "This order is completed. 🎉";
    case OrderStatus.CANCELLED:
      return "This order was cancelled by the customer.";
    case OrderStatus.REJECTED:
      return "This order was rejected by the ustad.";
  }
};

const OrderDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const order = await fetchOrder(id);

  if (!order) notFound();

  // Only the customer who placed the order and the gig owner may see it.
  const isCustomer = order.userId === session?.user.id;
  const isOwner = order.gigUser.userId === session?.user.id;
  if (!session || (!isCustomer && !isOwner)) notFound();

  const viewerRole = isCustomer ? "customer" : "ustad";

  return (
    <PageContainer>
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="sm:col-span-3 md:col-span-4">
          <OrderDetails order={order} viewerRole={viewerRole} />
        </Box>
        <Box className="sm:col-span-2 md:col-span-1">
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold">Actions</p>
            <p className="text-sm text-gray-500">
              {helperText(order.status, viewerRole)}
            </p>
            {isCustomer && order.status === OrderStatus.PENDING && (
              <>
                <EditOrder order={order} />
                <ChangeOrderStatusButton
                  orderId={order.id}
                  status="CANCELLED"
                  color="red"
                />
              </>
            )}
            {isOwner && order.status === OrderStatus.PENDING && (
              <>
                <ChangeOrderStatusButton
                  orderId={order.id}
                  status="ACCEPTED"
                  color="blue"
                />
                <ChangeOrderStatusButton
                  orderId={order.id}
                  status="REJECTED"
                  color="red"
                />
              </>
            )}
            {order.status === OrderStatus.ACCEPTED && (
              <ChangeOrderStatusButton
                orderId={order.id}
                status="COMPLETED"
                color="green"
              />
            )}
            <ChatButton
              receiverId={isCustomer ? order.gigUser.userId : order.userId}
              label={isCustomer ? "Message ustad" : "Message customer"}
            />
          </div>
        </Box>
      </Grid>
    </PageContainer>
  );
};

export async function generateMetadata({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const order = await fetchOrder(id);

  // Same participant rule as the page — don't leak gig titles to outsiders.
  const isParticipant =
    !!order &&
    !!session &&
    (order.userId === session.user.id ||
      order.gigUser.userId === session.user.id);

  return {
    title: isParticipant ? `Order on ${order.gigUser.title}` : "Order",
    description: isParticipant ? "Details of order " + order.id : "Order",
  };
}

export default OrderDetailPage;
