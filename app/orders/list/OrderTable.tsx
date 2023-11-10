import { OrderStatusBadge } from "@/app/components";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Order, OrderStatus } from "@prisma/client";

export interface IssueQuery {
  status: OrderStatus;
  orderBy: keyof Order;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  orders: Order[];
}

const IssueTable = ({ searchParams, orders }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                  },
                }}
              >
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy && (
                <ArrowUpIcon className="inline" />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell>
              <Link href={`/issues/${order.id}`}>{order.id}</Link>
              <div className="block md:hidden">
                <OrderStatusBadge status={order.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <OrderStatusBadge status={order.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {order.startedAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Order;
  className?: string;
}[] = [
  { label: "Order", value: "id" },
  {
    label: "Status",
    value: "status",
    className: "hidden md:table-cell",
  },
  {
    label: "Started",
    value: "startedAt",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;
