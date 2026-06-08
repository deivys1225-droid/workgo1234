"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, Navigation } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { parseJsonArray } from "@/lib/utils";

export default function CandidateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
    locationLabel: "",
    lat: "",
    lng: "",
    experienceYears: "0",
    resumeLink: "",
    resumeUrl: "",
    skills: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          const skills = parseJsonArray(p.skills);
          setForm({
            fullName: p.fullName || "",
            phone: p.phone || "",
            bio: p.bio || "",
            locationLabel: p.locationLabel || "",
            lat: p.lat?.toString() || "",
            lng: p.lng?.toString() || "",
            experienceYears: p.experienceYears?.toString() || "0",
            resumeLink: p.resumeLink || "",
            resumeUrl: p.resumeUrl || "",
            skills: skills.join(", "),
          });
        }
      });
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      update("lat", pos.coords.latitude.toString());
      update("lng", pos.coords.longitude.toString());
      update("locationLabel", "Mi ubicación actual");
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        update("resumeUrl", data.resumeUrl);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <GlassCard className="p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Mi perfil
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Completa tu perfil para postularte en 3 clics
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Nombre completo"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
          <Input
            label="Teléfono"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <Textarea
            label="Bio"
            placeholder="Cuéntanos sobre ti..."
            rows={3}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
          <Input
            label="Años de experiencia"
            type="number"
            value={form.experienceYears}
            onChange={(e) => update("experienceYears", e.target.value)}
          />
          <Input
            label="Habilidades (separadas por coma)"
            placeholder="JavaScript, React, Comunicación..."
            value={form.skills}
            onChange={(e) => update("skills", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hoja de vida (PDF)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm text-primary-700 hover:bg-white/80">
                <Upload className="h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
              {form.resumeUrl && (
                <span className="text-xs text-emerald-600">✓ CV subido</span>
              )}
            </div>
          </div>

          <Input
            label="Enlace a CV / LinkedIn (alternativa)"
            placeholder="https://linkedin.com/in/..."
            value={form.resumeLink}
            onChange={(e) => update("resumeLink", e.target.value)}
          />

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Ubicación"
                placeholder="Ciudad, barrio..."
                value={form.locationLabel}
                onChange={(e) => update("locationLabel", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={useMyLocation}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>

          {success && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Perfil actualizado correctamente
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Guardar perfil
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
