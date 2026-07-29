"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Avatar } from "@radix-ui/themes";
import {
  FaCompress,
  FaExpand,
  FaLocationCrosshairs,
  FaXmark,
} from "react-icons/fa6";
import { formatRate } from "@/app/lib/format";
import { DEFAULT_CENTER, DEFAULT_ZOOM, LatLng, MapBounds } from "@/app/lib/geo";
import { ExploreGig } from "./types";

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const pinIcon = (gig: ExploreGig, active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="gig-pin${active ? " gig-pin-active" : ""}">${formatRate(
      gig.rate,
      gig.job_type
    )}</div>`,
  });

const userIcon = L.divIcon({
  className: "",
  iconSize: [0, 0],
  html: '<div class="user-dot"></div>',
});

/** Keeps the viewport in sync with results, selection and user location. */
const MapEffects = ({
  located,
  selected,
  userLocation,
  onBoundsChange,
}: {
  located: ExploreGig[];
  selected: ExploreGig | null;
  userLocation: LatLng | null;
  onBoundsChange: (bounds: MapBounds) => void;
}) => {
  const map = useMap();
  const idsSignature = located.map((g) => g.id).join(",");

  // The container is display:none while the mobile list view is active;
  // camera moves on a 0×0 map produce NaN coordinates. Track real size and
  // only move the camera once the map is actually visible.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const check = () => {
      map.invalidateSize();
      const size = map.getSize();
      setReady(size.x > 0 && size.y > 0);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    if (!ready || selected) return;
    if (located.length > 0) {
      const bounds = L.latLngBounds(
        located.map((g) => [g.latitude!, g.longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsSignature, ready]);

  useEffect(() => {
    if (
      !ready ||
      !selected ||
      selected.latitude == null ||
      selected.longitude == null
    )
      return;
    map.flyTo(
      [selected.latitude, selected.longitude],
      Math.max(map.getZoom(), 14),
      { duration: 0.6 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, ready]);

  useEffect(() => {
    if (!ready || !userLocation) return;
    map.flyTo(
      [userLocation.lat, userLocation.lng],
      Math.max(map.getZoom(), 13),
      { duration: 0.6 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.lat, userLocation?.lng, ready]);

  // Report the visible area (once ready, then after every camera move) so
  // Explore can load only the gigs inside it.
  useEffect(() => {
    if (!ready) return;
    const report = () => {
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    };
    report();
    map.on("moveend", report);
    return () => {
      map.off("moveend", report);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, map]);

  return null;
};

interface Props {
  gigs: ExploreGig[];
  selectedId: string | null;
  userLocation: LatLng | null;
  isFullscreen: boolean;
  onSelect: (id: string | null) => void;
  onOpenDetail: (gig: ExploreGig) => void;
  onLocate: () => void;
  onToggleFullscreen: () => void;
  onBoundsChange: (bounds: MapBounds) => void;
}

const GigMap = ({
  gigs,
  selectedId,
  userLocation,
  isFullscreen,
  onSelect,
  onOpenDetail,
  onLocate,
  onToggleFullscreen,
  onBoundsChange,
}: Props) => {
  const mapRef = useRef<L.Map | null>(null);

  const located = useMemo(
    () => gigs.filter((g) => g.latitude != null && g.longitude != null),
    [gigs]
  );
  const selected = located.find((g) => g.id === selectedId) ?? null;

  return (
    <div className="relative isolate h-full w-full">
      <MapContainer
        ref={mapRef}
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl={false}
        className="z-0 h-full w-full"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapEffects
          located={located}
          selected={selected}
          userLocation={userLocation}
          onBoundsChange={onBoundsChange}
        />
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            interactive={false}
          />
        )}
        {located.map((gig) => (
          <Marker
            key={gig.id}
            position={[gig.latitude!, gig.longitude!]}
            icon={pinIcon(gig, gig.id === selectedId)}
            zIndexOffset={gig.id === selectedId ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(gig.id) }}
          />
        ))}
      </MapContainer>

      <div className="absolute right-3 top-3 z-1000 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Center on my location"
          onClick={onLocate}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-md transition hover:bg-gray-50"
        >
          <FaLocationCrosshairs size={16} />
        </button>
        <button
          type="button"
          aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          onClick={onToggleFullscreen}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-md transition hover:bg-gray-50"
        >
          {isFullscreen ? <FaCompress size={15} /> : <FaExpand size={15} />}
        </button>
      </div>

      {selected && (
        <div className="absolute inset-x-3 bottom-16 z-1000 rounded-2xl bg-white p-3 shadow-xl lg:bottom-3">
          <div className="flex items-center gap-3">
            <Avatar
              size="3"
              radius="full"
              src={selected.user.image ?? undefined}
              fallback={(selected.user.name ?? selected.title)[0]}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-tight">
                {selected.title}
              </p>
              <p className="truncate text-sm text-gray-500">
                {selected.user.name ?? "Ustad"} · {selected.profession.title}
              </p>
            </div>
            <span className="shrink-0 font-bold">
              {formatRate(selected.rate, selected.job_type)}
            </span>
            <button
              type="button"
              onClick={() => onOpenDetail(selected)}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              View
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onSelect(null)}
              className="shrink-0 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
            >
              <FaXmark size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigMap;
