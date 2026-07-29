"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { FaLocationCrosshairs } from "react-icons/fa6";
import toast from "react-hot-toast";
import { DEFAULT_CENTER, DEFAULT_ZOOM, LatLng } from "@/app/lib/geo";

const pinIcon = L.divIcon({
  className: "",
  iconSize: [0, 0],
  html: '<div class="picker-pin"></div>',
});

const ClickHandler = ({ onPick }: { onPick: (loc: LatLng) => void }) => {
  useMapEvents({
    click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
};

interface Props {
  value: LatLng | null;
  onChange: (loc: LatLng) => void;
}

const LocationPicker = ({ value, onChange }: Props) => {
  const mapRef = useRef<L.Map | null>(null);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(loc);
        mapRef.current?.flyTo([loc.lat, loc.lng], 15);
      },
      () => toast.error("Couldn't access your location.")
    );
  };

  return (
    <div className="relative isolate h-56 overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={value ? [value.lat, value.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={value ? 14 : DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ClickHandler onPick={onChange} />
        {value && (
          <Marker
            position={[value.lat, value.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const p = (e.target as L.Marker).getLatLng();
                onChange({ lat: p.lat, lng: p.lng });
              },
            }}
          />
        )}
      </MapContainer>
      <button
        type="button"
        onClick={useMyLocation}
        className="absolute right-2 top-2 z-1000 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-md transition hover:bg-gray-50"
      >
        <FaLocationCrosshairs size={12} />
        Use my location
      </button>
      <p className="absolute bottom-2 left-2 z-1000 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow-sm">
        {value
          ? `Pinned at ${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}`
          : "Tap the map to drop your pin"}
      </p>
    </div>
  );
};

export default LocationPicker;
