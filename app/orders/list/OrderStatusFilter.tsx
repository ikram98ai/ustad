"use client";

import { OrderStatus } from "@/prisma/models";
import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const statuses: { label: string; value?: OrderStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "In progress", value: "ACCEPTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Rejected", value: "REJECTED" },
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
  const active = searchParams.get("status") ?? "";

  const setStatus = (value?: OrderStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("status", value);
    else params.delete("status");
    params.delete("page"); // back to page 1 when the filter changes
    const query = params.size ? "?" + params.toString() : "";
    router.push("/orders/list" + query);
  };

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 lg:mx-0 lg:px-0">
      {statuses.map((status) => (
        <button
          key={status.label}
          type="button"
          onClick={() => setStatus(status.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition",
            active === (status.value ?? "")
              ? "bg-ink text-white"
              : "bg-gray-100 text-ink hover:bg-gray-200"
          )}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

export default OrderStatusFilter;
