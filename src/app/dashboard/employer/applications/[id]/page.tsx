import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { parseJsonArray } from "@/lib/utils";
import { ApplicationActions } from "@/components/applications/ApplicationActions";
import { ChatBox } from "@/components/applications/ChatBox";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: { include: { employer: { include: { profile: true } } } },
      candidate: { include: { profile: true } },
      messages: {
        include: { sender: { include: { profile: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!application) redirect("/dashboard/employer/applications");

  const isEmployer = application.job.employerId === session.userId;
  const isCandidate = application.candidateId === session.userId;

  if (!isEmployer && !isCandidate) redirect("/");

  const profile = application.candidate.profile;
  const skills = profile ? parseJsonArray(profile.skills) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={
          isEmployer
            ? "/dashboard/employer/applications"
            : "/dashboard/candidate"
        }
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">
                {isEmployer
                  ? profile?.fullName || application.candidate.email
                  : application.job.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEmployer
                  ? application.job.title
                  : application.job.employer.profile?.companyName ||
                    application.job.employer.profile?.fullName}
              </p>
            </div>
            <Badge status={application.status} />
          </div>

          {profile && isEmployer && (
            <div className="mt-6 space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Bio</h3>
                  <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Experiencia
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {profile.experienceYears} años
                </p>
              </div>
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Habilidades
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.locationLabel && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Ubicación
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile.locationLabel}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    <Download className="h-4 w-4" />
                    Descargar CV
                  </a>
                )}
                {profile.resumeLink && (
                  <a
                    href={profile.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl glass px-4 py-2 text-sm font-medium text-primary-700 hover:bg-white/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver perfil
                  </a>
                )}
              </div>
            </div>
          )}

          {application.coverNote && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">
                Nota de postulación
              </h3>
              <p className="text-sm text-gray-600 mt-1 italic">
                &quot;{application.coverNote}&quot;
              </p>
            </div>
          )}

          {isEmployer && application.status === "pending" && (
            <ApplicationActions applicationId={application.id} />
          )}
        </GlassCard>

        <ChatBox
          applicationId={application.id}
          messages={application.messages.map((m) => ({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            senderId: m.senderId,
            senderName: m.sender.profile?.fullName || m.sender.email,
            isOwn: m.senderId === session.userId,
          }))}
        />
      </div>
    </div>
  );
}
