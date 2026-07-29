"use client";

import { haversineKm, LatLng } from "@/app/lib/geo";
import { Profession } from "@/prisma/models";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import cn from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaListUl, FaMap } from "react-icons/fa6";
import GigList from "./GigList";
import SearchFilterBar from "./SearchFilterBar";
import { DEFAULT_FILTERS, ExploreGig, GigFilters } from "./types";

const GigMap = dynamic(() => import("./GigMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
});

const SORT_LABEL: Record<GigFilters["sort"], string> = {
  recommended: "Newest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  nearest: "Nearest first",
};

interface Props {
  professions: Profession[];
  initialGigs: ExploreGig[];
}

const Explore = ({ professions, initialGigs }: Props) => {
  const [filters, setFilters] = useState<GigFilters>(DEFAULT_FILTERS);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(filters.q.trim()), 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  // "nearest" is sorted client-side; keep the API sort stable for it.
  const apiSort = filters.sort === "nearest" ? "recommended" : filters.sort;
  const isDefaultQuery =
    !debouncedQ &&
    !filters.professionId &&
    !filters.jobType &&
    !filters.maxRate &&
    apiSort === "recommended";

  const { data: gigs, isFetching } = useQuery<ExploreGig[]>({
    queryKey: [
      "explore-gigs",
      debouncedQ,
      filters.professionId,
      filters.jobType,
      filters.maxRate,
      apiSort,
    ],
    queryFn: () =>
      axios
        .get<ExploreGig[]>("/api/gigs", {
          params: {
            q: debouncedQ || undefined,
            professionId: filters.professionId || undefined,
            jobType: filters.jobType || undefined,
            maxRate: filters.maxRate || undefined,
            sort: apiSort,
          },
        })
        .then((res) => res.data),
    initialData: isDefaultQuery ? initialGigs : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const sortedGigs = useMemo(() => {
    const list = gigs ?? [];
    if (filters.sort !== "nearest" || !userLocation) return list;
    return [...list].sort((a, b) => {
      const da =
        a.latitude != null && a.longitude != null
          ? haversineKm(userLocation, { lat: a.latitude, lng: a.longitude })
          : Infinity;
      const db =
        b.latitude != null && b.longitude != null
          ? haversineKm(userLocation, { lat: b.latitude, lng: b.longitude })
          : Infinity;
      return da - db;
    });
  }, [gigs, filters.sort, userLocation]);

  const patchFilters = (patch: Partial<GigFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const locate = (onSuccess?: (loc: LatLng) => void) => {
    if (!("geolocation" in navigator)) {
      toast.error("Location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        onSuccess?.(loc);
      },
      () => toast.error("Couldn't access your location.")
    );
  };

  const showOnMap = (id: string) => {
    setSelectedId(id);
    setMobileView("map");
  };

  return (
    <div className="flex flex-col gap-1">
      <SearchFilterBar
        filters={filters}
        professions={professions}
        hasLocation={!!userLocation}
        onChange={patchFilters}
        onNearMe={() => locate(() => patchFilters({ sort: "nearest" }))}
      />

      <div className="lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start lg:gap-5">
        <section className={cn(mobileView === "map" && "hidden", "lg:block")}>
          <div className="mb-2 flex items-center justify-between px-1 text-sm text-gray-500">
            <span>
              {sortedGigs.length} {sortedGigs.length === 1 ? "pro" : "pros"}{" "}
              available
              {isFetching && " · updating…"}
            </span>
            <span>{SORT_LABEL[filters.sort]}</span>
          </div>
          <GigList
            gigs={sortedGigs}
            userLocation={userLocation}
            selectedId={selectedId}
            onShowOnMap={showOnMap}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </section>

        <section
          className={cn(
            mobileView === "list" && "hidden",
            "h-[calc(100dvh-21rem)] min-h-80 overflow-hidden rounded-2xl border border-gray-200 shadow-sm",
            "lg:sticky lg:top-17 lg:block lg:h-[calc(100dvh-6.5rem)]"
          )}
        >
          <GigMap
            gigs={sortedGigs}
            selectedId={selectedId}
            userLocation={userLocation}
            onSelect={setSelectedId}
            onLocate={() => locate()}
          />
        </section>
      </div>

      <button
        type="button"
        onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-95 lg:hidden"
      >
        {mobileView === "list" ? (
          <>
            <FaMap size={14} /> Map
          </>
        ) : (
          <>
            <FaListUl size={14} /> List
          </>
        )}
      </button>
    </div>
  );
};

export default Explore;
