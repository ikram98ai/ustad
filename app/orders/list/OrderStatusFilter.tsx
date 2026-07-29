"use client";

import { OrderStatus } from "@/prisma/models";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const statuses: { label: string; value?: OrderStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Working", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed", value: "COMPLETED" },
];

// useSearchParams needs its own Suspense boundary so pages that render this
// filter can still be statically prerendered.
const OrderStatusFilter = () => (
  <Suspense>
    <OrderStatusFilterInner />
  </Suspense>
);

const OrderStatusFilterInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get("status") || "ALL"}
      onValueChange={(status) => {
        const params = new URLSearchParams();
        if (status !== "ALL") params.append("status", status);
        if (searchParams.get("orderBy"))
          params.append("orderBy", searchParams.get("orderBy")!);

        const query = params.size ? "?" + params.toString() : "";
        router.push("/orders/list" + query);
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.label} value={status.value || "ALL"}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default OrderStatusFilter;
