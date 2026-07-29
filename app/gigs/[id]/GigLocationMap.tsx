"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";

const pinIcon = L.divIcon({
  className: "",
  iconSize: [0, 0],
  html: '<div class="picker-pin"></div>',
});

interface Props {
  lat: number;
  lng: number;
  rangeKm: number;
}

const GigLocationMap = ({ lat, lng, rangeKm }: Props) => {
  return (
    <div className="isolate h-64 overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={[lat, lng]} icon={pinIcon} interactive={false} />
        {rangeKm > 0 && (
          <Circle
            center={[lat, lng]}
            radius={rangeKm * 1000}
            pathOptions={{
              color: "#14181f",
              weight: 1.5,
              fillColor: "#14181f",
              fillOpacity: 0.08,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default GigLocationMap;
