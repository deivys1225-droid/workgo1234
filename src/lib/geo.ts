/** Haversine distance in meters between two lat/lng points */
export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const DEFAULT_LOCATION: GeoPoint = {
  lat: 4.711,
  lng: -74.0721, // Bogotá
};

export const DEFAULT_LOCATION_LABEL = "Bogotá, Colombia";

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "WorkGo/1.0" } }
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.state ||
      data.display_name?.split(",").slice(0, 2).join(",") ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    );
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export async function searchLocation(
  query: string
): Promise<Array<{ label: string; lat: number; lng: number }>> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { "User-Agent": "WorkGo/1.0" } }
    );
    const data = await res.json();
    return data.map(
      (item: { display_name: string; lat: string; lon: string }) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      })
    );
  } catch {
    return [];
  }
}
