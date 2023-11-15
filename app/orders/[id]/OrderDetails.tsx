import { OrderStatusBadge } from "@/app/components";
import { Order } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const OrderDetails = ({ order }: { order: Order }) => {
  return (
    <>
      <Heading>{order.userId}</Heading>
      <Flex className="space-x-3" my="2">
        <OrderStatusBadge status={order.status} />
        <Text>{order.startedAt.toDateString()}</Text>
      </Flex>
      <Flex className="space-x-4" my="2" align='center'>
        <Text className="font-semibold">${order.rate}</Text>
        <Text className="text-xs font-semibold">rate {order.job_type} </Text>
      </Flex>
      <Card className="prose max-w-full" mt="4">
        <ReactMarkdown>{order.requirements}</ReactMarkdown>
      </Card>
    </>
  );
};

export default OrderDetails;
