import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Search,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { getDistanceMeters, DEFAULT_LOCATION } from "@/lib/geo";
import { JobCard } from "@/components/jobs/JobCard";

export default async function HomePage() {
  const jobs = await prisma.job.findMany({
    where: { status: "active" },
    include: { employer: { include: { profile: true } } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const jobsWithDistance = jobs
    .map((job) => ({
      ...job,
      distance:
        job.lat && job.lng
          ? getDistanceMeters(
              DEFAULT_LOCATION.lat,
              DEFAULT_LOCATION.lng,
              job.lat,
              job.lng
            )
          : undefined,
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
            alt="Profesionales trabajando"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white/90 to-white" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-primary-600">
              <Zap className="h-4 w-4" />
              Contratación local inteligente
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Encuentra empleos{" "}
              <span className="text-primary-600">cerca de ti</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Work Go conecta empleadores con talento local usando
              geolocalización en tiempo real. Postúlate en 3 clics y encuentra
              tu próximo trabajo a la vuelta de la esquina.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Buscar empleos
                </Button>
              </Link>
              <Link href="/register?role=employer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Publicar oferta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Geolocalización",
              desc: "Empleos ordenados por proximidad a tu ubicación actual o seleccionada.",
            },
            {
              icon: Zap,
              title: "3 clics para postular",
              desc: "Perfil completo, un clic en Postularme y listo. Sin formularios eternos.",
            },
            {
              icon: Shield,
              title: "Seguro y confiable",
              desc: "Perfiles verificados, gestión de candidatos y mensajería interna.",
            },
          ].map((feature) => (
            <GlassCard key={feature.title} hover className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Empleos destacados
            </h2>
            <p className="mt-2 text-gray-500">
              Oportunidades cerca de Bogotá
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobsWithDistance.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/jobs">
            <Button variant="secondary">Ver todos los empleos</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <GlassCard className="relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-primary-500" />
            <h2 className="mt-4 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="mt-3 max-w-lg text-gray-500">
              Únete a miles de profesionales y empresas que ya confían en
              Work Go para conectar talento local.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/register?role=candidate">
                <Button size="lg">Busco empleo</Button>
              </Link>
              <Link href="/register?role=employer">
                <Button variant="secondary" size="lg">
                  Soy empleador
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </>
  );
}
