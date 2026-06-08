"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";
import type { JobWithDistance } from "@/types";
import { formatDistance, formatSalary, workTypeLabel } from "@/lib/utils";

const jobIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, map]);
  return null;
}

interface JobMapInnerProps {
  jobs: JobWithDistance[];
  center: { lat: number; lng: number };
  onJobClick?: (jobId: string) => void;
  selectedJobId?: string | null;
}

export default function JobMapInner({
  jobs,
  center,
  onJobClick,
}: JobMapInnerProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="h-[400px] w-full rounded-2xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <Marker position={[center.lat, center.lng]} icon={userIcon}>
        <Popup>Tu ubicación</Popup>
      </Marker>
      <Circle
        center={[center.lat, center.lng]}
        radius={10000}
        pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.05, weight: 1 }}
      />
      {jobs
        .filter((j) => j.lat && j.lng)
        .map((job) => (
          <Marker
            key={job.id}
            position={[job.lat!, job.lng!]}
            icon={jobIcon}
            eventHandlers={{
              click: () => onJobClick?.(job.id),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold text-gray-900">{job.title}</p>
                <p className="text-xs text-gray-500 mt-1">{job.locationLabel}</p>
                <p className="text-xs text-primary-600 mt-1">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </p>
                {job.distance !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistance(job.distance)} de distancia
                  </p>
                )}
                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-2 inline-block text-xs font-medium text-primary-600 hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
