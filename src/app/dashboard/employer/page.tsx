import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, Users, Plus, Bell, TrendingUp } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getEmployerJobs,
  getApplications,
  unreadNotificationCount,
} from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function EmployerDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "employer") redirect("/dashboard/candidate");

  const jobs = getEmployerJobs(session.userId);
  const applications = getApplications({ employerId: session.userId }).slice(0, 5);
  const unreadNotifications = unreadNotificationCount(session.userId);

  const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0);
  const pendingApplications = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Panel de empleador</h1>
          <p className="mt-1 text-gray-500">Hola, {session.fullName}</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nueva oferta</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Briefcase, label: "Ofertas activas", value: jobs.filter((j) => j.status === "active").length, color: "text-primary-600 bg-primary-100" },
          { icon: Users, label: "Postulaciones", value: totalApplications, color: "text-emerald-600 bg-emerald-100" },
          { icon: TrendingUp, label: "Pendientes", value: pendingApplications, color: "text-amber-600 bg-amber-100" },
          { icon: Bell, label: "Notificaciones", value: unreadNotifications, color: "text-purple-600 bg-purple-100" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
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
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Mis ofertas</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <GlassCard key={job.id} hover className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{job._count.applications} postulaciones</p>
                  </div>
                  <Badge status={job.status} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Postulaciones recientes</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <Link key={app.id} href={`/dashboard/employer/applications/${app.id}`}>
                <GlassCard hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{app.candidate?.profile.fullName}</p>
                      <p className="text-xs text-gray-500 mt-1">{app.job?.title}</p>
                    </div>
                    <Badge status={app.status} />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
