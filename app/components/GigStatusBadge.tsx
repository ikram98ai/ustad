import { AvailabilityStatus as Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OFLINE: { label: "Ofline", color: "red" },
  ONWORK: { label: "On Work", color: "violet" },
  ONLINE: { label: "Online", color: "green" },
};

const GigStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default GigStatusBadge;
