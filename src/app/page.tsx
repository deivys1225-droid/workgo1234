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
import { FeatureCard } from "@/components/home/FeatureCard";
import { getJobs } from "@/lib/store";
import { DEFAULT_LOCATION } from "@/lib/geo";
import { JobCard } from "@/components/jobs/JobCard";

const FEATURES = [
  {
    icon: MapPin,
    title: "Geolocalización",
    desc: "Empleos ordenados por proximidad a tu ubicación actual o seleccionada.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=480&fit=crop&q=80",
  },
  {
    icon: Zap,
    title: "3 clics para postular",
    desc: "Perfil completo, un clic en Postularme y listo. Sin formularios eternos.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=480&fit=crop&q=80",
  },
  {
    icon: Shield,
    title: "Seguro y confiable",
    desc: "Perfiles verificados, gestión de candidatos y mensajería interna.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=480&fit=crop&q=80",
  },
];

export default function HomePage() {
  const jobsWithDistance = getJobs({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  }).slice(0, 6);

  return (
    <>
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

        <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-primary-600">
              <Zap className="h-4 w-4" />
              Proyecto escolar — contratación local
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Encuentra empleos{" "}
              <span className="text-primary-600">cerca de ti</span>
            </h1>
            <p className="mt-5 text-base text-gray-600 leading-relaxed sm:text-lg">
              Work Go conecta empleadores con talento local usando
              geolocalización. Demo interactiva sin base de datos ni registro.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Search className="h-5 w-5" />
                  Buscar empleos
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto">
                  <Briefcase className="h-5 w-5" />
                  Entrar como empleador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            ¿Por qué Work Go?
          </h2>
          <p className="mt-2 text-gray-500">
            Funciones clave de la plataforma
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Empleos destacados
            </h2>
            <p className="mt-2 text-gray-500">Oportunidades cerca de Bogotá</p>
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
        <div className="mt-6 text-center sm:hidden">
          <Link href="/jobs">
            <Button variant="secondary">Ver todos los empleos</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <GlassCard className="relative overflow-hidden p-8 sm:p-12">
          <div className="relative flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-primary-500" />
            <h2 className="mt-4 font-display text-2xl font-bold text-gray-900">
              Prueba la demo
            </h2>
            <p className="mt-3 max-w-lg text-gray-500">
              Entra como empleador o candidato con un clic. Sin contraseñas.
            </p>
            <Link href="/login">
              <Button size="lg" className="mt-6">
                Entrar a Work Go
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </>
  );
}
