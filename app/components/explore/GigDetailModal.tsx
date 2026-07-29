"use client";

import ChatButton from "@/app/gigs/[id]/ChatButton";
import GigLocationMap from "@/app/gigs/[id]/GigLocationMapLazy";
import GigOrder from "@/app/gigs/_components/GigOrder";
import { formatRate, JOB_TYPE_LABEL } from "@/app/lib/format";
import { formatDistance, haversineKm, LatLng } from "@/app/lib/geo";
import { Avatar, Dialog } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FaArrowRight, FaLocationDot, FaXmark } from "react-icons/fa6";
import { ExploreGig } from "./types";

interface Props {
  gig: ExploreGig | null;
  userLocation: LatLng | null;
  onClose: () => void;
}

const GigDetailModal = ({ gig, userLocation, onClose }: Props) => {
  const { data: session } = useSession();
  const isOwnGig = !!gig && session?.user.id === gig.userId;
  const distanceKm =
    gig && userLocation && gig.latitude != null && gig.longitude != null
      ? haversineKm(userLocation, { lat: gig.latitude, lng: gig.longitude })
      : null;

  return (
    <Dialog.Root open={!!gig} onOpenChange={(open) => !open && onClose()}>
      {gig && (
        <Dialog.Content style={{ maxWidth: 580 }} aria-describedby={undefined}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                size="4"
                radius="full"
                src={gig.user.image ?? undefined}
                fallback={(gig.user.name ?? gig.title)[0]}
              />
              <div>
                <p className="font-semibold leading-tight">
                  {gig.user.name ?? "Ustad"}
                </p>
                <p className="text-sm text-gray-500">{gig.profession.title}</p>
              </div>
            </div>
            <Dialog.Close>
              <button
                type="button"
                aria-label="Close"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <FaXmark size={16} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title mt="4" mb="1" className="tracking-tight">
            {gig.title}
          </Dialog.Title>

          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-2xl font-extrabold tracking-tight">
              {formatRate(gig.rate, gig.job_type)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
              {JOB_TYPE_LABEL[gig.job_type]}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
              Covers {gig.range} km
            </span>
            {distanceKm != null && (
              <span className="flex items-center gap-1 rounded-full bg-safety px-3 py-1 text-xs font-bold text-ink">
                <FaLocationDot size={10} />
                {formatDistance(distanceKm)} away
              </span>
            )}
          </div>

          <div className="prose prose-sm max-h-48 max-w-none overflow-y-auto rounded-xl bg-gray-50 p-4">
            <ReactMarkdown>{gig.description}</ReactMarkdown>
          </div>

          {gig.latitude != null && gig.longitude != null && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <FaLocationDot size={12} />
                Service area
                {gig.address && (
                  <span className="truncate font-normal text-gray-500">
                    — {gig.address}
                  </span>
                )}
              </p>
              <GigLocationMap
                lat={gig.latitude}
                lng={gig.longitude}
                rangeKm={gig.range}
              />
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
            {isOwnGig ? (
              <Link
                href={`/gigs/edit/${gig.id}`}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                Edit your gig
              </Link>
            ) : (
              <>
                <GigOrder gigId={gig.id} ownerId={gig.userId} />
                <ChatButton receiverId={gig.userId} />
              </>
            )}
            <Link
              href={`/gigs/${gig.id}`}
              className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-ink"
            >
              Full page <FaArrowRight size={12} />
            </Link>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default GigDetailModal;
