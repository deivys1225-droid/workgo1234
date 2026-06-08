import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Plus,
  Bell,
  TrendingUp,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function EmployerDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "employer") redirect("/dashboard/candidate");

  const [jobs, applications, unreadNotifications] = await Promise.all([
    prisma.job.findMany({
      where: { employerId: session.userId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { job: { employerId: session.userId } },
      include: {
        candidate: { include: { profile: true } },
        job: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notification.count({
      where: { userId: session.userId, read: false },
    }),
  ]);

  const totalApplications = jobs.reduce(
    (sum, j) => sum + j._count.applications,
    0
  );
  const pendingApplications = applications.filter(
    (a) => a.status === "pending"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Panel de empleador
          </h1>
          <p className="mt-1 text-gray-500">
            Gestiona tus ofertas y candidatos
          </p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva oferta
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Briefcase,
            label: "Ofertas activas",
            value: jobs.filter((j) => j.status === "active").length,
            color: "text-primary-600 bg-primary-100",
          },
          {
            icon: Users,
            label: "Total postulaciones",
            value: totalApplications,
            color: "text-emerald-600 bg-emerald-100",
          },
          {
            icon: TrendingUp,
            label: "Pendientes",
            value: pendingApplications,
            color: "text-amber-600 bg-amber-100",
          },
          {
            icon: Bell,
            label: "Notificaciones",
            value: unreadNotifications,
            color: "text-purple-600 bg-purple-100",
          },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Jobs list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Mis ofertas
            </h2>
            <Link
              href="/dashboard/employer/jobs"
              className="text-sm text-primary-600 hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  Aún no has publicado ofertas
                </p>
                <Link href="/dashboard/employer/jobs/new">
                  <Button variant="secondary" size="sm" className="mt-4">
                    Crear primera oferta
                  </Button>
                </Link>
              </GlassCard>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <GlassCard key={job.id} hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {job._count.applications} postulaciones
                      </p>
                    </div>
                    <Badge status={job.status} />
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Recent applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Postulaciones recientes
            </h2>
            <Link
              href="/dashboard/employer/applications"
              className="text-sm text-primary-600 hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  Sin postulaciones aún
                </p>
              </GlassCard>
            ) : (
              applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/employer/applications/${app.id}`}
                >
                  <GlassCard hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {app.candidate.profile?.fullName || app.candidate.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {app.job.title}
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
      </div>
    </div>
  );
}
