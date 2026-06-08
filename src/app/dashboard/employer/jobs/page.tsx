import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default async function EmployerJobsPage() {
  const session = await getSession();
  if (!session || session.role !== "employer") redirect("/login");

  const jobs = await prisma.job.findMany({
    where: { employerId: session.userId },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Mis ofertas
          </h1>
          <p className="mt-2 text-gray-500">{jobs.length} ofertas publicadas</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {jobs.map((job) => (
          <GlassCard key={job.id} hover className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {job.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {job.locationLabel} · {job._count.applications} postulaciones
                </p>
              </div>
              <Badge status={job.status} />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
