import { OrderStatusBadge } from "@/app/components";
import { formatRate } from "@/app/lib/format";
import { Order } from "@/prisma/models";
import { Avatar } from "@radix-ui/themes";
import cn from "classnames";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FaArrowRightLong } from "react-icons/fa6";
import OrderStatusStepper from "./OrderStatusStepper";

export type OrderWithRelations = Order & {
  user: { name: string | null; image: string | null };
  gigUser: {
    userId: string;
    title: string;
    user: { name: string | null; image: string | null };
  };
};

const formatDate = (date: Date) =>
  date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Party = ({
  name,
  image,
  role,
  isViewer,
}: {
  name: string | null;
  image: string | null;
  role: string;
  isViewer: boolean;
}) => (
  <div className="flex min-w-0 flex-1 items-center gap-3">
    <Avatar
      src={image ?? undefined}
      fallback={name?.[0] ?? "?"}
      size="3"
      radius="full"
      referrerPolicy="no-referrer"
    />
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 truncate font-semibold leading-tight">
        {name ?? "Ustad user"}
        {isViewer && (
          <span className="rounded-full bg-safety px-1.5 py-0.5 text-[10px] font-bold text-ink">
            You
          </span>
        )}
      </p>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
  </div>
);

const OrderDetails = ({
  order,
  viewerRole,
}: {
  order: OrderWithRelations;
  viewerRole: "customer" | "ustad";
}) => {
  const tiles = [
    { label: "Offered rate", value: formatRate(order.rate, order.job_type) },
    { label: "Placed on", value: formatDate(order.startedAt) },
    order.endAt
      ? { label: "Ended on", value: formatDate(order.endAt) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Order · #{order.id.slice(-6)}
            </p>
            <Link href={`/gigs/${order.gigId}`} className="hover:underline">
              <h1 className="mb-0 mt-1">{order.gigUser.title}</h1>
            </Link>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="mt-5 border-t border-gray-100 pt-4">
          <OrderStatusStepper status={order.status} />
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-3",
          tiles.length > 2 && "sm:grid-cols-3"
        )}
      >
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl bg-gray-50 p-3.5">
            <p className="text-xs text-gray-500">{tile.label}</p>
            <p className="mt-1 font-bold">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
        <Party
          name={order.user.name}
          image={order.user.image}
          role="Customer"
          isViewer={viewerRole === "customer"}
        />
        <FaArrowRightLong className="shrink-0 text-gray-300" size={16} />
        <Party
          name={order.gigUser.user.name}
          image={order.gigUser.user.image}
          role="Ustad"
          isViewer={viewerRole === "ustad"}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Requirements</p>
        <div className="prose prose-sm max-w-none rounded-2xl border border-gray-200 bg-white p-5">
          <ReactMarkdown>{order.requirements}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
