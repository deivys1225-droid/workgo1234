"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    bio: "",
    locationLabel: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setForm({
            fullName: data.profile.fullName || "",
            companyName: data.profile.companyName || "",
            phone: data.profile.phone || "",
            bio: data.profile.bio || "",
            locationLabel: data.profile.locationLabel || "",
          });
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <GlassCard className="p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Perfil de empresa
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Nombre de la empresa"
            value={form.fullName}
            onChange={(e) =>
              setForm((p) => ({ ...p, fullName: e.target.value }))
            }
            required
          />
          <Input
            label="Nombre comercial"
            value={form.companyName}
            onChange={(e) =>
              setForm((p) => ({ ...p, companyName: e.target.value }))
            }
          />
          <Input
            label="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Textarea
            label="Descripción"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          />
          <Input
            label="Ubicación"
            value={form.locationLabel}
            onChange={(e) =>
              setForm((p) => ({ ...p, locationLabel: e.target.value }))
            }
          />
          {success && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Perfil actualizado
            </div>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Guardar
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
