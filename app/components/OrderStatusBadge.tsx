import { OrderStatus } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const statusMap: Record<
  OrderStatus,
  { label: string; color: "red" | "violet" | "green" }
> = {
  PENDING: { label: "Pending", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  COMPLETE: { label: "Complete", color: "green" },
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default OrderStatusBadge;
