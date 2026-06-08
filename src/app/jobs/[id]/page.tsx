import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  formatSalary,
  formatDistance,
  workTypeLabel,
  parseJsonObject,
} from "@/lib/utils";
import { getDistanceMeters, DEFAULT_LOCATION } from "@/lib/geo";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { include: { profile: true } },
      applications: session
        ? { where: { candidateId: session.userId }, select: { id: true } }
        : false,
    },
  });

  if (!job) notFound();

  const distance =
    job.lat && job.lng
      ? getDistanceMeters(
          DEFAULT_LOCATION.lat,
          DEFAULT_LOCATION.lng,
          job.lat,
          job.lng
        )
      : undefined;

  const requirements = parseJsonObject<{
    resume?: boolean;
    experience?: string;
    documents?: string[];
  }>(job.requirements, {});

  const alreadyApplied =
    session?.role === "candidate" &&
    Array.isArray(job.applications) &&
    job.applications.length > 0;

  const profile = job.employer.profile;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empleos
      </Link>

      <GlassCard className="overflow-hidden">
        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-primary-100 to-blue-50">
          {job.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-16 w-16 text-primary-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge status={job.workType === "remote" ? "active" : "pending"} />
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              {job.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {job.locationLabel && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary-500" />
                {job.locationLabel}
                {distance !== undefined && (
                  <span className="text-primary-600 font-medium">
                    ({formatDistance(distance)})
                  </span>
                )}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary-500" />
              {workTypeLabel(job.workType)}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary-500" />
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>

          {profile && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50/80 p-4">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {profile.companyName || profile.fullName}
                </p>
                {profile.bio && (
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Descripción
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {(requirements.resume ||
            requirements.experience ||
            (requirements.documents && requirements.documents.length > 0)) && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                Requisitos
              </h2>
              <ul className="mt-3 space-y-2">
                {requirements.resume && (
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-primary-500" />
                    Hoja de vida requerida
                  </li>
                )}
                {requirements.experience && (
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-primary-500" />
                    Experiencia: {requirements.experience}
                  </li>
                )}
                {requirements.documents?.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <FileText className="h-4 w-4 text-primary-500" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {session?.role === "candidate" ? (
              <ApplyButton
                jobId={job.id}
                jobTitle={job.title}
                alreadyApplied={!!alreadyApplied}
              />
            ) : session?.role === "employer" ? (
              <p className="text-sm text-gray-500">
                Inicia sesión como candidato para postularte
              </p>
            ) : (
              <Link href={`/login?redirect=/jobs/${job.id}`}>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3 text-base font-medium text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700">
                  Iniciar sesión para postularme
                </button>
              </Link>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
