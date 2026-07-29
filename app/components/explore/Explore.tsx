"use client";

import {
  boundsAround,
  DEFAULT_CENTER,
  haversineKm,
  LatLng,
  MapBounds,
  viewportLeftSearchedArea,
} from "@/app/lib/geo";
import { Profession } from "@/prisma/models";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import cn from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaListUl, FaMap, FaRotateRight } from "react-icons/fa6";
import GigDetailModal from "./GigDetailModal";
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
}

const Explore = ({ professions }: Props) => {
  const [filters, setFilters] = useState<GigFilters>(DEFAULT_FILTERS);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailGig, setDetailGig] = useState<ExploreGig | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Area-based loading: gigs are fetched only for `searchedBounds`. The next
  // bounds the map reports are auto-adopted when the ref is set (initial load
  // and after "near me"); any later camera move just tracks `currentBounds`
  // until the user explicitly hits "Search this area".
  const [searchedBounds, setSearchedBounds] = useState<MapBounds | null>(null);
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);
  const adoptNextBounds = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(filters.q.trim()), 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  // Try to start centered on the user so only nearby pros are loaded first.
  // Silent on failure — the map then loads around the default city center.
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        adoptNextBounds.current = true;
        setUserLocation(loc);
        // Search near the user right away, even while the map is hidden
        // (mobile list view); a visible map refines this with real bounds.
        setSearchedBounds(boundsAround(loc));
      },
      () => {},
      { maximumAge: 300_000, timeout: 8_000 }
    );
  }, []);

  // Fallback when the map never reports (hidden on mobile) and geolocation
  // hasn't answered: search around the default center so the list still loads.
  useEffect(() => {
    if (searchedBounds) return;
    const t = setTimeout(
      () => setSearchedBounds((prev) => prev ?? boundsAround(DEFAULT_CENTER)),
      1200
    );
    return () => clearTimeout(t);
  }, [searchedBounds]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  // "nearest" is sorted client-side; keep the API sort stable for it.
  const apiSort = filters.sort === "nearest" ? "recommended" : filters.sort;

  const { data: gigs, isFetching } = useQuery<ExploreGig[]>({
    queryKey: [
      "explore-gigs",
      debouncedQ,
      filters.professionId,
      filters.jobType,
      filters.maxRate,
      apiSort,
      searchedBounds,
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
            ...searchedBounds,
          },
        })
        .then((res) => res.data),
    enabled: !!searchedBounds,
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

  const handleBoundsChange = (bounds: MapBounds) => {
    setCurrentBounds(bounds);
    if (adoptNextBounds.current) {
      adoptNextBounds.current = false;
      setSearchedBounds(bounds);
    }
  };

  const showSearchArea =
    !!searchedBounds &&
    !!currentBounds &&
    viewportLeftSearchedArea(searchedBounds, currentBounds);

  const searchThisArea = () => {
    if (!currentBounds) return;
    setSelectedId(null);
    setSearchedBounds(currentBounds);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SearchFilterBar
        filters={filters}
        professions={professions}
        hasLocation={!!userLocation}
        onChange={patchFilters}
        onNearMe={() =>
          locate(() => {
            adoptNextBounds.current = true;
            patchFilters({ sort: "nearest" });
          })
        }
      />

      <div className="mt-2 flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-5">
        <section
          className={cn(
            mobileView === "map" && "hidden",
            "flex min-h-0 flex-1 flex-col lg:flex"
          )}
        >
          <div className="mb-2 flex shrink-0 items-center justify-between px-1 text-sm text-gray-500">
            <span>
              {!gigs
                ? "Finding pros in your area…"
                : `${sortedGigs.length} ${
                    sortedGigs.length === 1 ? "pro" : "pros"
                  } in this area${isFetching ? " · updating…" : ""}`}
            </span>
            <span>{SORT_LABEL[filters.sort]}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pb-4 lg:pr-2">
            {!gigs ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-28 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <GigList
                gigs={sortedGigs}
                userLocation={userLocation}
                selectedId={selectedId}
                onOpenDetail={setDetailGig}
                onShowOnMap={showOnMap}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            )}
          </div>
        </section>

        <section
          className={cn(
            "relative",
            isFullscreen
              ? "fixed inset-0 z-70 bg-white"
              : cn(
                  mobileView === "list" && "hidden lg:block",
                  "min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
                )
          )}
        >
          <GigMap
            gigs={sortedGigs}
            selectedId={selectedId}
            userLocation={userLocation}
            isFullscreen={isFullscreen}
            onSelect={setSelectedId}
            onOpenDetail={setDetailGig}
            onLocate={() =>
              locate(() => {
                adoptNextBounds.current = true;
              })
            }
            onToggleFullscreen={() => setIsFullscreen((f) => !f)}
            onBoundsChange={handleBoundsChange}
          />
          {showSearchArea && (
            <button
              type="button"
              onClick={searchThisArea}
              className="absolute left-1/2 top-3 z-1000 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-xl transition hover:bg-ink-soft active:scale-95"
            >
              <FaRotateRight size={12} className={cn(isFetching && "animate-spin")} />
              Search this area
            </button>
          )}
        </section>
      </div>

      {!isFullscreen && (
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
      )}

      <GigDetailModal
        gig={detailGig}
        userLocation={userLocation}
        onClose={() => setDetailGig(null)}
      />
    </div>
  );
};

export default Explore;
