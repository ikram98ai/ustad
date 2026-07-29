import { OrderStatusBadge } from "@/app/components";
import { formatRate } from "@/app/lib/format";
import { Order, OrderStatus } from "@/prisma/models";
import Link from "next/link";
import React from "react";
import { FaChevronRight, FaFileLines } from "react-icons/fa6";

export interface OrderQuery {
  status: OrderStatus;
  orderBy: keyof Order;
  page: string;
  type?: "placed" | "received";
}

interface UserOrder extends Order {
  user: {
    name: string | null;
  };
  gigUser: {
    title: string;
    user: { name: string | null };
  };
}

interface Props {
  searchParams: OrderQuery;
  orders: UserOrder[];
  type: "placed" | "received";
}

const formatDate = (date: Date) =>
  date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

const OrderTable = ({ orders, type }: Props) => {
  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.id}`}
            className="flex items-center gap-4 px-4 py-3.5 transition hover:bg-gray-50"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-400">
              <FaFileLines size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{order.gigUser.title}</p>
              <p className="mt-0.5 truncate text-sm text-gray-500">
                {type === "received"
                  ? `From ${order.user.name ?? "a customer"}`
                  : `With ${order.gigUser.user.name ?? "an ustad"}`}{" "}
                · {formatDate(order.startedAt)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="font-bold">
                {formatRate(order.rate, order.job_type)}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <FaChevronRight size={12} className="shrink-0 text-gray-300" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default OrderTable;
