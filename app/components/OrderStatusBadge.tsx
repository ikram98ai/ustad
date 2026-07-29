import { OrderStatus } from "@/prisma/models";
import cn from "classnames";
import React from "react";

const statusMap: Record<
  OrderStatus,
  { label: string; pill: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  ACCEPTED: {
    label: "In progress",
    pill: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-green-50 text-green-700 ring-green-600/20",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-gray-100 text-gray-600 ring-gray-500/20",
    dot: "bg-gray-400",
  },
  REJECTED: {
    label: "Rejected",
    pill: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { label, pill, dot } = statusMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        pill
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
};

export default OrderStatusBadge;
