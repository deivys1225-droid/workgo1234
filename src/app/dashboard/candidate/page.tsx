import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, MapPin, Send } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function CandidateDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "candidate") redirect("/dashboard/employer");

  const [applications, profile] = await Promise.all([
    prisma.application.findMany({
      where: { candidateId: session.userId },
      include: { job: { include: { employer: { include: { profile: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.profile.findUnique({ where: { userId: session.userId } }),
  ]);

  const profileComplete =
    profile?.fullName &&
    (profile?.resumeUrl || profile?.resumeLink) &&
    profile?.locationLabel;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Mis postulaciones
          </h1>
          <p className="mt-1 text-gray-500">
            Hola, {profile?.fullName || "candidato"}
          </p>
        </div>
        <Link href="/jobs">
          <Button variant="secondary" className="gap-2">
            <MapPin className="h-4 w-4" />
            Buscar empleos
          </Button>
        </Link>
      </div>

      {!profileComplete && (
        <GlassCard className="mt-6 p-5 border-amber-200/50 bg-amber-50/30">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">
                Completa tu perfil para postularte
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Necesitas agregar tu hoja de vida y ubicación.
              </p>
              <Link href="/dashboard/candidate/profile">
                <Button size="sm" className="mt-3">
                  Completar perfil
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="mt-8 space-y-3">
        {applications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Send className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">
              Aún no te has postulado a ningún empleo
            </p>
            <Link href="/jobs">
              <Button className="mt-4">Explorar empleos</Button>
            </Link>
          </GlassCard>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/employer/applications/${app.id}`}
            >
              <GlassCard hover className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{app.job.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {app.job.employer.profile?.companyName ||
                        app.job.employer.profile?.fullName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(app.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
