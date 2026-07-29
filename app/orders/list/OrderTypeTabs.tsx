import cn from "classnames";
import Link from "next/link";
import { OrderQuery } from "./OrderTable";

interface Props {
  searchParams: OrderQuery;
  active: "placed" | "received";
}

const tabs = [
  { label: "Placed", value: "placed" },
  { label: "Received", value: "received" },
] as const;

// Segmented control switching between offers the user made and orders
// received on their gigs. Resets to page 1 on switch.
const OrderTypeTabs = ({ searchParams, active }: Props) => (
  <div className="flex w-fit gap-1 rounded-full bg-surface p-1">
    {tabs.map((tab) => (
      <Link
        key={tab.value}
        href={{
          query: { ...searchParams, type: tab.value, page: "1" },
        }}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-semibold transition",
          active === tab.value
            ? "bg-ink text-white shadow-sm"
            : "text-gray-500 hover:text-ink"
        )}
      >
        {tab.label}
      </Link>
    ))}
  </div>
);

export default OrderTypeTabs;
