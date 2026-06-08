"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

function EnterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  async function enterAs(role: "employer" | "candidate") {
    setLoading(role);
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const redirect = searchParams.get("redirect");
    router.push(
      redirect ||
        (role === "employer" ? "/dashboard/employer" : "/dashboard/candidate")
    );
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Entrar a Work Go
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Proyecto escolar — elige un rol demo, sin registro ni contraseña
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full gap-2 h-auto py-4"
            onClick={() => enterAs("candidate")}
            loading={loading === "candidate"}
          >
            <User className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Busco empleo</div>
              <div className="text-xs opacity-80 font-normal">
                Entrar como María González (candidata)
              </div>
            </div>
          </Button>
          <Button
            variant="secondary"
            className="w-full gap-2 h-auto py-4"
            onClick={() => enterAs("employer")}
            loading={loading === "employer"}
          >
            <Building2 className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Soy empleador</div>
              <div className="text-xs opacity-80 font-normal">
                Entrar como TechCorp Colombia
              </div>
            </div>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/jobs" className="text-primary-600 hover:underline">
            Ver empleos sin entrar →
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <EnterPage />
    </Suspense>
  );
}
