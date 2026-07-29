export interface LatLng {
  lat: number;
  lng: number;
}

// Fallback map center when there are no located gigs and no user position.
export const DEFAULT_CENTER: LatLng = { lat: 33.6844, lng: 73.0479 }; // Islamabad
export const DEFAULT_ZOOM = 12;

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/** A viewport-sized box around a point, for searching without a visible map. */
export function boundsAround(center: LatLng, radiusKm = 10): MapBounds {
  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));
  return {
    north: center.lat + dLat,
    south: center.lat - dLat,
    east: center.lng + dLng,
    west: center.lng - dLng,
  };
}

/**
 * True when the current viewport extends meaningfully outside the area that
 * was last searched — i.e. the user panned away or zoomed out, so the loaded
 * results no longer cover what they're looking at. Zooming further into the
 * searched area never triggers it (those results are already loaded).
 */
export function viewportLeftSearchedArea(
  searched: MapBounds,
  current: MapBounds
): boolean {
  const latPad = (searched.north - searched.south) * 0.15;
  const lngPad = (searched.east - searched.west) * 0.15;
  return (
    current.north > searched.north + latPad ||
    current.south < searched.south - latPad ||
    current.east > searched.east + lngPad ||
    current.west < searched.west - lngPad
  );
}
