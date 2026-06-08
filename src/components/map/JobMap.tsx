"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import type { JobWithDistance } from "@/types";

const JobMapInner = dynamic(() => import("./JobMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-100/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
    </div>
  ),
});

interface JobMapProps {
  jobs: JobWithDistance[];
  center: { lat: number; lng: number };
  onJobClick?: (jobId: string) => void;
  selectedJobId?: string | null;
}

export function JobMap({ jobs, center, onJobClick, selectedJobId }: JobMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-100/50">
        <MapPin className="h-8 w-8 text-primary-400 animate-pulse" />
      </div>
    );
  }

  return (
    <JobMapInner
      jobs={jobs}
      center={center}
      onJobClick={onJobClick}
      selectedJobId={selectedJobId}
    />
  );
}
