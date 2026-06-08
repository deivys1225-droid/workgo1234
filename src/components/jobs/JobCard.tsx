"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  formatSalary,
  formatDistance,
  workTypeLabel,
} from "@/lib/utils";
import type { JobWithDistance } from "@/types";

interface JobCardProps {
  job: JobWithDistance;
  selected?: boolean;
  onSelect?: () => void;
}

export function JobCard({ job, selected, onSelect }: JobCardProps) {
  return (
    <GlassCard
      hover
      className={`overflow-hidden cursor-pointer ${selected ? "ring-2 ring-primary-400" : ""}`}
    >
      <div onClick={onSelect}>
        <div className="relative h-36 w-full bg-gradient-to-br from-primary-100 to-blue-50">
          {job.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-primary-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge status={job.workType === "remote" ? "active" : "pending"} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-gray-900 line-clamp-1">
              {job.title}
            </h3>
            {job.distance !== undefined && (
              <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600">
                {formatDistance(job.distance)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {job.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {job.locationLabel && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.locationLabel}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {workTypeLabel(job.workType)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-600">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
            <Link
              href={`/jobs/${job.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Ver más →
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
