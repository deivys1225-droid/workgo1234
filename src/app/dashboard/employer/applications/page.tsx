import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getApplications } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export default async function EmployerApplicationsPage() {
  const session = await getSession();
  if (!session || session.role !== "employer") redirect("/login");

  const applications = getApplications({ employerId: session.userId });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-gray-900">Postulaciones recibidas</h1>
      <div className="mt-8 space-y-3">
        {applications.map((app) => (
          <Link key={app.id} href={`/dashboard/employer/applications/${app.id}`}>
            <GlassCard hover className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{app.candidate?.profile.fullName}</p>
                  <p className="text-sm text-gray-500 mt-1">{app.job?.title}</p>
                </div>
                <Badge status={app.status} />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
