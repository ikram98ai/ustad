import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { cache } from "react";
import OrderDetails from "./OrderDetails";
import ChangeOrderStatusButton from "./ChangeOrderStatusButton";
import { OrderStatus } from "@prisma/client";
import EditOrder from "../_components/EditOrder";

interface Props {
  params: { id: string };
}

const fetchOrder = cache((orderId: string) =>
  prisma.order.findUnique({ where: { id: orderId } })
);

const OrderDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const order = await fetchOrder(params.id);

  if (!order) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <OrderDetails order={order} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <EditOrder order={order} />
            {order.status === OrderStatus.PENDING &&
              order.userId === session.user.id && (
                <ChangeOrderStatusButton
                  orderId={order.id}
                  status="CANCELLED"
                  color="red"
                />
              )}
            {order.status === OrderStatus.PENDING &&
              order.gigId !== session.user.id && (
                <>
                  <ChangeOrderStatusButton
                    orderId={order.id}
                    status="REJECTED"
                    color="red"
                  />

                  <ChangeOrderStatusButton
                    orderId={order.id}
                    status="ACCEPTED"
                    color="violet"
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
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const order = await fetchOrder(params.id);

  return {
    title: order?.id,
    description: "Details of order " + order?.id,
  };
}

export default OrderDetailPage;
