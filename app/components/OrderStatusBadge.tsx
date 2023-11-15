import { OrderStatus } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const statusMap: Record<
  OrderStatus,
  { label: string; color: "orange" | "red" | "violet" | "green" }
> = {
  PENDING: { label: "Pending", color: "orange" },
  CANCELLED: { label: "Canceled", color: "red" },
  REJECTED: { label: "Rejected", color: "red" },
  ACCEPTED: { label: "In Progress", color: "violet" },
  COMPLETED: { label: "Completed", color: "green" },
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default OrderStatusBadge;
