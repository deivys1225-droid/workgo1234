"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, Navigation, List, Map as MapIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { JobMap } from "@/components/map/JobMap";
import { DEFAULT_LOCATION, DEFAULT_LOCATION_LABEL } from "@/lib/geo";
import type { JobWithDistance } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION_LABEL);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("all");
  const [radius, setRadius] = useState("25000");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      radius,
      ...(workType !== "all" && { workType }),
      ...(search && { search }),
    });

    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  }, [location, radius, workType, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function useMyLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel("Mi ubicación actual");
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("No se pudo obtener tu ubicación. Verifica los permisos.");
      }
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Empleos cerca de ti
        </h1>
        <p className="mt-2 text-gray-500">
          {jobs.length} empleos encontrados cerca de {locationLabel}
        </p>
      </div>

      {/* Filters */}
      <GlassCard className="mb-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Input
              label="Buscar"
              placeholder="Título, descripción, ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-40">
            <Select
              label="Tipo"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              options={[
                { value: "all", label: "Todos" },
                { value: "onsite", label: "Presencial" },
                { value: "remote", label: "Remoto" },
                { value: "hybrid", label: "Híbrido" },
              ]}
            />
          </div>
          <div className="w-full lg:w-40">
            <Select
              label="Radio"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              options={[
                { value: "5000", label: "5 km" },
                { value: "10000", label: "10 km" },
                { value: "25000", label: "25 km" },
                { value: "50000", label: "50 km" },
              ]}
            />
          </div>
          <Button
            variant="secondary"
            onClick={useMyLocation}
            loading={locating}
            className="shrink-0"
          >
            <Navigation className="h-4 w-4" />
            Mi ubicación
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          {locationLabel} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
        </div>
      </GlassCard>

      {/* View toggle */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={view === "list" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4" />
          Lista
        </Button>
        <Button
          variant={view === "map" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setView("map")}
        >
          <MapIcon className="h-4 w-4" />
          Mapa
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : view === "map" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <JobMap
            jobs={jobs}
            center={location}
            onJobClick={setSelectedJobId}
            selectedJobId={selectedJobId}
          />
          <div className="max-h-[400px] space-y-3 overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`cursor-pointer rounded-xl p-3 transition-all ${
                  selectedJobId === job.id
                    ? "glass ring-2 ring-primary-400"
                    : "hover:bg-white/50"
                }`}
                onClick={() => setSelectedJobId(job.id)}
              >
                <p className="font-medium text-gray-900">{job.title}</p>
                <p className="text-xs text-gray-500">{job.locationLabel}</p>
              </div>
            ))}
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">
            No se encontraron empleos con estos filtros
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={selectedJobId === job.id}
              onSelect={() => setSelectedJobId(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
