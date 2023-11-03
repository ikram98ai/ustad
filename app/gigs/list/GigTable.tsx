import { GigStatusBadge } from "@/app/components";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Gig, AvailabilityStatus as Status } from "@prisma/client";

export interface gigQuery {
  status: Status;
  orderBy: keyof Gig;
  page: string;
}

interface Props {
  searchParams: gigQuery;
  gigs: Gig[];
}

const GigTable = ({ searchParams, gigs }: Props) => {
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
        {gigs.map((gig) => (
          <Table.Row key={gig.id}>
            <Table.Cell>
              <Link href={`/gigs/${gig.id}`}>{gig.title}</Link>
              <div className="block md:hidden">
                <GigStatusBadge status={gig.availability_staus} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <GigStatusBadge status={gig.availability_staus} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {gig.created_at.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Gig;
  className?: string;
}[] = [
  { label: "gig", value: "title" },
  {
    label: "Status",
    value: "availability_staus",
    className: "hidden md:table-cell",
  },
  {
    label: "Created",
    value: "created_at",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

export default GigTable;
