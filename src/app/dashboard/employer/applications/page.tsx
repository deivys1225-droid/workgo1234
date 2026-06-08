import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export default async function EmployerApplicationsPage() {
  const session = await getSession();
  if (!session || session.role !== "employer") redirect("/login");

  const applications = await prisma.application.findMany({
    where: { job: { employerId: session.userId } },
    include: {
      candidate: { include: { profile: true } },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-gray-900">
        Postulaciones recibidas
      </h1>
      <p className="mt-2 text-gray-500">
        {applications.length} postulaciones en total
      </p>

      <div className="mt-8 space-y-3">
        {applications.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-gray-500">No hay postulaciones aún</p>
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
                    <p className="font-medium text-gray-900">
                      {app.candidate.profile?.fullName || app.candidate.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {app.job.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(app.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
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
