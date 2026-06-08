"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase, User, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "candidate";

  const [role, setRole] = useState<"employer" | "candidate">(
    defaultRole === "employer" ? "employer" : "candidate"
  );
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, fullName, companyName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrarse");
        return;
      }

      if (role === "employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/candidate/profile");
      }
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Únete a Work Go hoy
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("candidate")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
              role === "candidate"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            )}
          >
            <User className="h-4 w-4" />
            Busco empleo
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
              role === "employer"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            )}
          >
            <Building2 className="h-4 w-4" />
            Empleador
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label={role === "employer" ? "Nombre de la empresa" : "Nombre completo"}
            placeholder={role === "employer" ? "Mi Empresa S.A." : "Juan Pérez"}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {role === "employer" && (
            <Input
              label="Nombre comercial (opcional)"
              placeholder="Marca comercial"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
