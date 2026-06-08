"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DEFAULT_LOCATION, DEFAULT_LOCATION_LABEL } from "@/lib/geo";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "COP",
    workType: "onsite",
    locationLabel: DEFAULT_LOCATION_LABEL,
    lat: DEFAULT_LOCATION.lat.toString(),
    lng: DEFAULT_LOCATION.lng.toString(),
    experience: "1+ años",
    resumeRequired: true,
    imageUrl: "",
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requirements: {
            resume: form.resumeRequired,
            experience: form.experience,
            documents: form.resumeRequired ? ["Hoja de vida"] : [],
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear oferta");
        return;
      }

      router.push("/dashboard/employer");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/employer"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>

      <GlassCard className="p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Publicar nueva oferta
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Completa los detalles del empleo
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Título del empleo"
            placeholder="Ej: Mesero/a, Auxiliar de bodega"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <Textarea
            label="Descripción"
            placeholder="Describe las responsabilidades y el perfil ideal..."
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Salario mínimo (opcional)"
              type="number"
              placeholder="2000000"
              value={form.salaryMin}
              onChange={(e) => update("salaryMin", e.target.value)}
            />
            <Input
              label="Salario máximo (opcional)"
              type="number"
              placeholder="4000000"
              value={form.salaryMax}
              onChange={(e) => update("salaryMax", e.target.value)}
            />
          </div>
          <Select
            label="Tipo de trabajo"
            value={form.workType}
            onChange={(e) => update("workType", e.target.value)}
            options={[
              { value: "onsite", label: "Presencial" },
              { value: "remote", label: "Remoto" },
              { value: "hybrid", label: "Híbrido" },
            ]}
          />
          <Input
            label="Ubicación"
            placeholder="Ciudad, barrio..."
            value={form.locationLabel}
            onChange={(e) => update("locationLabel", e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitud"
              value={form.lat}
              onChange={(e) => update("lat", e.target.value)}
            />
            <Input
              label="Longitud"
              value={form.lng}
              onChange={(e) => update("lng", e.target.value)}
            />
          </div>
          <Input
            label="Experiencia requerida"
            placeholder="2+ años"
            value={form.experience}
            onChange={(e) => update("experience", e.target.value)}
          />
          <Input
            label="URL de imagen (opcional)"
            placeholder="https://images.unsplash.com/..."
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.resumeRequired}
              onChange={(e) => update("resumeRequired", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Requiere hoja de vida
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Publicar oferta
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
