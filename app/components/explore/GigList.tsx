"use client";

import GigOrder from "@/app/gigs/_components/GigOrder";
import { formatRate } from "@/app/lib/format";
import { formatDistance, haversineKm, LatLng } from "@/app/lib/geo";
import { Avatar, Button } from "@radix-ui/themes";
import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { FaLocationDot, FaMapLocationDot } from "react-icons/fa6";
import { ExploreGig } from "./types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface Props {
  gigs: ExploreGig[];
  userLocation: LatLng | null;
  selectedId: string | null;
  onShowOnMap: (id: string) => void;
  onReset: () => void;
}

const GigList = ({
  gigs,
  userLocation,
  selectedId,
  onShowOnMap,
  onReset,
}: Props) => {
  const [now] = useState(() => Date.now());

  if (gigs.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
        <FaMapLocationDot size={36} className="text-gray-300" />
        <p className="font-semibold">No pros match your search</p>
        <p className="text-sm text-gray-500">
          Try a different keyword or clear some filters.
        </p>
        <Button variant="soft" color="gray" onClick={onReset}>
          Clear all filters
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {gigs.map((gig) => {
        const distanceKm =
          userLocation && gig.latitude != null && gig.longitude != null
            ? haversineKm(userLocation, {
                lat: gig.latitude,
                lng: gig.longitude,
              })
            : null;
        const isNew = now - new Date(gig.created_at).getTime() < WEEK_MS;

        return (
          <article
            key={gig.id}
            className={cn(
              "relative rounded-2xl border bg-white p-4 transition hover:shadow-md",
              gig.id === selectedId
                ? "border-ink ring-1 ring-ink"
                : "border-gray-200"
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar
                size="4"
                radius="full"
                src={gig.user.image ?? undefined}
                fallback={(gig.user.name ?? gig.title)[0]}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/gigs/${gig.id}`}
                    className="truncate font-semibold hover:underline after:absolute after:inset-0"
                  >
                    {gig.title}
                  </Link>
                  <span className="shrink-0 font-bold">
                    {formatRate(gig.rate, gig.job_type)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-gray-500">
                  {gig.user.name ?? "Ustad"} · {gig.profession.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {isNew && (
                    <span className="rounded-full bg-safety px-2 py-0.5 font-bold text-ink">
                      New
                    </span>
                  )}
                  {distanceKm != null && (
                    <span className="flex items-center gap-1 font-medium text-ink">
                      <FaLocationDot size={11} />
                      {formatDistance(distanceKm)} away
                    </span>
                  )}
                  <span>Covers {gig.range} km</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <GigOrder gigId={gig.id} />
              {gig.latitude != null && (
                <button
                  type="button"
                  onClick={() => onShowOnMap(gig.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  <FaMapLocationDot size={14} />
                  Show on map
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default GigList;
