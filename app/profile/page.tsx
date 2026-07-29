import authOptions from "@/app/auth/authOptions";
import { formatRate } from "@/app/lib/format";
import prisma from "@/prisma/client";
import { OrderStatus } from "@/prisma/models";
import { Avatar, Button } from "@radix-ui/themes";
import cn from "classnames";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaChevronRight,
  FaEnvelope,
  FaPhone,
  FaPlus,
  FaScrewdriverWrench,
} from "react-icons/fa6";

type StatusCounts = { status: OrderStatus; _count: { _all: number } }[];

const countOf = (rows: StatusCounts, ...statuses: OrderStatus[]) =>
  rows
    .filter((row) => statuses.includes(row.status))
    .reduce((sum, row) => sum + row._count._all, 0);

const Stat = ({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) => (
  <div
    className={cn(
      "rounded-xl p-4",
      accent ? "bg-ink text-white" : "bg-gray-50"
    )}
  >
    <p className={cn("text-xs", accent ? "text-gray-300" : "text-gray-500")}>
      {label}
    </p>
    <p className="mt-1 text-xl font-extrabold tracking-tight">{value}</p>
    {hint && (
      <p
        className={cn(
          "mt-0.5 text-xs",
          accent ? "text-gray-400" : "text-gray-400"
        )}
      >
        {hint}
      </p>
    )}
  </div>
);

const SectionHeader = ({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) => (
  <div className="mb-2.5 flex items-baseline justify-between">
    <h2 className="text-base font-bold tracking-tight">{title}</h2>
    {href && (
      <Link
        href={href}
        className="text-sm font-medium text-gray-500 transition hover:text-ink"
      >
        {linkLabel} →
      </Link>
    )}
  </div>
);

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/profile");
  const userId = session.user.id;

  const [user, gigs, receivedByStatus, earned, placedByStatus, spent] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, phone: true },
      }),
      prisma.gig.findMany({
        where: { userId },
        include: {
          profession: { select: { title: true } },
          _count: { select: { orders: true } },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { gigUser: { userId } },
      }),
      prisma.order.aggregate({
        _sum: { rate: true },
        where: { status: "COMPLETED", gigUser: { userId } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { userId },
      }),
      prisma.order.aggregate({
        _sum: { rate: true },
        where: { status: "COMPLETED", userId },
      }),
    ]);

  const isUstad = gigs.length > 0;
  const receivedTotal = receivedByStatus.reduce(
    (sum, row) => sum + row._count._all,
    0
  );
  const placedTotal = placedByStatus.reduce(
    (sum, row) => sum + row._count._all,
    0
  );
  const receivedCompleted = countOf(receivedByStatus, "COMPLETED");
  const placedCompleted = countOf(placedByStatus, "COMPLETED");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Identity */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="h-20 bg-ink" />
        <div className="h-1.5 bg-safety" />
        <div className="px-5 pb-5">
          <div className="-mt-9 flex items-end justify-between gap-3">
            <Avatar
              src={user?.image ?? undefined}
              fallback={user?.name?.charAt(0).toUpperCase() ?? "?"}
              size="7"
              radius="full"
              referrerPolicy="no-referrer"
              className="rounded-full ring-4 ring-white"
            />
            <Button variant="soft" highContrast asChild>
              <Link href="/auth/complete-profile">Edit profile</Link>
            </Button>
          </div>
          <p className="mt-3 text-xl font-bold tracking-tight">
            {user?.name ?? "Unnamed user"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {user?.email && (
              <span className="flex items-center gap-1.5">
                <FaEnvelope size={12} className="text-gray-400" />
                {user.email}
              </span>
            )}
            {user?.phone && (
              <span className="flex items-center gap-1.5">
                <FaPhone size={12} className="text-gray-400" />
                {user.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Money at a glance */}
      <div className="grid grid-cols-2 gap-3">
        <Stat
          accent
          label="Earned as ustad"
          value={`$${earned._sum.rate ?? 0}`}
          hint={`from ${receivedCompleted} completed order${
            receivedCompleted === 1 ? "" : "s"
          }`}
        />
        <Stat
          label="Spent as customer"
          value={`$${spent._sum.rate ?? 0}`}
          hint={`across ${placedCompleted} completed order${
            placedCompleted === 1 ? "" : "s"
          }`}
        />
      </div>

      {/* Ustad activity */}
      {isUstad ? (
        <section>
          <SectionHeader
            title="Gig activity"
            href="/orders/list?type=received"
            linkLabel="Received orders"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              label="Active gigs"
              value={gigs.filter((gig) => gig.is_active).length}
            />
            <Stat label="Orders received" value={receivedTotal} />
            <Stat
              label="In progress"
              value={countOf(receivedByStatus, "ACCEPTED")}
            />
            <Stat label="Completed" value={receivedCompleted} />
            <Stat
              label="Declined"
              value={countOf(receivedByStatus, "CANCELLED", "REJECTED")}
              hint="cancelled or rejected"
            />
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">
          <FaScrewdriverWrench size={30} className="text-gray-300" />
          <p className="font-semibold">Become an ustad</p>
          <p className="max-w-sm text-sm text-gray-500">
            Publish a gig with your skills, rate and service area — customers
            nearby will find you on the map.
          </p>
          <Link
            href="/gigs/new"
            className="mt-1 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            Create your first gig
          </Link>
        </div>
      )}

      {/* Customer activity */}
      <section>
        <SectionHeader
          title="Customer activity"
          href="/orders/list?type=placed"
          linkLabel="Placed orders"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Orders placed" value={placedTotal} />
          <Stat
            label="In progress"
            value={countOf(placedByStatus, "ACCEPTED")}
          />
          <Stat label="Completed" value={placedCompleted} />
          <Stat label="Cancelled" value={countOf(placedByStatus, "CANCELLED")} />
        </div>
      </section>

      {/* Gigs */}
      {isUstad && (
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">Your gigs</h2>
            <Link
              href="/gigs/new"
              className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              <FaPlus size={11} /> New gig
            </Link>
          </div>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {gigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/gigs/${gig.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-gray-50"
                >
                  <span
                    title={gig.is_active ? "Active" : "Paused"}
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      gig.is_active ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{gig.title}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {gig.profession.title} ·{" "}
                      {formatRate(gig.rate, gig.job_type)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    {gig._count.orders} order{gig._count.orders === 1 ? "" : "s"}
                  </span>
                  <FaChevronRight size={12} className="shrink-0 text-gray-300" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;

export const dynamic = "force-dynamic";
