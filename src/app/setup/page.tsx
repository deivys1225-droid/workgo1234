"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SetupPage() {
  const [key, setKey] = useState("workgo2026");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ok?: boolean;
    message?: string;
    userCount?: number;
    jobCount?: number;
    accounts?: { employer: string; candidate: string };
    error?: string;
  } | null>(null);

  async function handleSetup() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/setup?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <GlassCard className="p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <Database className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Configurar Work Go
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Carga los empleos demo y cuentas de prueba con un clic. No necesitas
            terminal.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Input
            label="Clave de configuración"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="workgo2026"
          />
          <p className="text-xs text-gray-400">
            Clave por defecto: <code className="text-primary-600">workgo2026</code>
          </p>

          <Button
            className="w-full gap-2"
            onClick={handleSetup}
            loading={loading}
          >
            <Database className="h-4 w-4" />
            Cargar datos demo
          </Button>
        </div>

        {result?.ok && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-emerald-800">{result.message}</p>
                <p className="mt-2 text-emerald-700">
                  {result.userCount} usuarios · {result.jobCount} empleos
                </p>
                <div className="mt-3 space-y-1 text-emerald-700">
                  <p>Empleador: {result.accounts?.employer}</p>
                  <p>Candidato: {result.accounts?.candidate}</p>
                </div>
                <Link href="/">
                  <Button size="sm" className="mt-4 gap-1">
                    Ir a Work Go <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-xl bg-primary-50/50 p-4 text-xs text-gray-600 space-y-2">
          <p className="font-medium text-gray-800">Antes de usar esta página:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Despliega la app en Vercel</li>
            <li>Configura DATABASE_URL (Neon) en Vercel</li>
            <li>Vuelve aquí y pulsa &quot;Cargar datos demo&quot;</li>
          </ol>
        </div>
      </GlassCard>
    </div>
  );
}
