"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Textarea } from "@/components/ui/Input";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  alreadyApplied?: boolean;
}

export function ApplyButton({ jobId, jobTitle, alreadyApplied }: ApplyButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, coverNote }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push(`/login?redirect=/jobs/${jobId}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Error al postularse");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        router.refresh();
      }, 2000);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (alreadyApplied) {
    return (
      <Button variant="secondary" disabled className="gap-2">
        <CheckCircle className="h-4 w-4" />
        Ya postulado
      </Button>
    );
  }

  return (
    <>
      <Button size="lg" className="gap-2" onClick={() => setShowModal(true)}>
        <Send className="h-5 w-5" />
        Postularme
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
                <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
                  ¡Postulación enviada!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tu perfil fue enviado al empleador de &quot;{jobTitle}&quot;
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold text-gray-900">
                  Postularme a {jobTitle}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tu perfil y hoja de vida se enviarán automáticamente al empleador.
                </p>
                <div className="mt-4">
                  <Textarea
                    label="Nota opcional"
                    placeholder="Cuéntale al empleador por qué eres ideal para este puesto..."
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                    {error.includes("hoja de vida") && (
                      <a
                        href="/dashboard/candidate/profile"
                        className="block mt-1 font-medium underline"
                      >
                        Completar perfil →
                      </a>
                    )}
                  </div>
                )}
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    loading={loading}
                    onClick={handleApply}
                  >
                    Confirmar postulación
                  </Button>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      )}
    </>
  );
}
