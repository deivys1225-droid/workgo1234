import type { JobWithDistance } from "@/types";

export interface DemoUser {
  id: string;
  email: string;
  role: "employer" | "candidate";
  profile: {
    fullName: string;
    companyName?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    lat?: number | null;
    lng?: number | null;
    locationLabel?: string | null;
    skills: string;
    experienceYears: number;
    bio?: string | null;
    resumeUrl?: string | null;
    resumeLink?: string | null;
  };
}

export interface DemoApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: "pending" | "accepted" | "rejected";
  coverNote?: string | null;
  createdAt: string;
}

export interface DemoNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface DemoMessage {
  id: string;
  applicationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export const DEMO_EMPLOYER_ID = "emp-1";
export const DEMO_EMPLOYER2_ID = "emp-2";
export const DEMO_CANDIDATE_ID = "cand-1";

export const demoUsers: DemoUser[] = [
  {
    id: DEMO_EMPLOYER_ID,
    email: "empleador@workgo.com",
    role: "employer",
    profile: {
      fullName: "TechCorp Colombia",
      companyName: "TechCorp Colombia",
      locationLabel: "Bogotá, Colombia",
      lat: 4.6533,
      lng: -74.0836,
      bio: "Empresa de tecnología líder en soluciones digitales.",
      avatarUrl:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
      skills: "[]",
      experienceYears: 0,
    },
  },
  {
    id: DEMO_EMPLOYER2_ID,
    email: "restaurante@workgo.com",
    role: "employer",
    profile: {
      fullName: "Sabores del Valle",
      companyName: "Sabores del Valle",
      locationLabel: "Chapinero, Bogotá",
      lat: 4.6486,
      lng: -74.0628,
      bio: "Restaurante gourmet con enfoque local.",
      skills: "[]",
      experienceYears: 0,
    },
  },
  {
    id: DEMO_CANDIDATE_ID,
    email: "candidato@workgo.com",
    role: "candidate",
    profile: {
      fullName: "María González",
      locationLabel: "Bogotá, Colombia",
      lat: 4.711,
      lng: -74.0721,
      skills: JSON.stringify([
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "Comunicación",
      ]),
      experienceYears: 3,
      bio: "Desarrolladora frontend apasionada por crear experiencias digitales.",
      resumeLink: "https://linkedin.com/in/mariagonzalez",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
  },
];

export const demoJobs: JobWithDistance[] = [
  {
    id: "job-1",
    employerId: DEMO_EMPLOYER_ID,
    title: "Desarrollador Frontend React",
    description:
      "Buscamos un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo de producto. Trabajarás en aplicaciones web modernas con enfoque en UX.",
    salaryMin: 3500000,
    salaryMax: 5000000,
    salaryCurrency: "COP",
    workType: "hybrid",
    lat: 4.6533,
    lng: -74.0836,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "2+ años",
      documents: ["Hoja de vida"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    employerId: DEMO_EMPLOYER_ID,
    title: "Diseñador UX/UI",
    description:
      "Únete a nuestro equipo creativo para diseñar interfaces intuitivas y atractivas. Experiencia con Figma y design systems requerida.",
    salaryMin: 3000000,
    salaryMax: 4500000,
    salaryCurrency: "COP",
    workType: "remote",
    lat: null,
    lng: null,
    locationLabel: "Remoto - Colombia",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "1+ años",
      documents: ["Portafolio"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-3",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Chef de Cocina",
    description:
      "Restaurante gourmet busca chef con experiencia en cocina internacional. Ambiente dinámico y oportunidades de crecimiento.",
    salaryMin: 2500000,
    salaryMax: 3500000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.6486,
    lng: -74.0628,
    locationLabel: "Zona G, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "3+ años",
      documents: ["Certificaciones"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-4",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Mesero/a Experiencia Premium",
    description:
      "Buscamos mesero/a con excelente actitud y experiencia en servicio de alta calidad. Turnos flexibles.",
    salaryMin: 1800000,
    salaryMax: 2200000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.65,
    lng: -74.061,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "6 meses+",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-5",
    employerId: DEMO_EMPLOYER_ID,
    title: "DevOps Engineer",
    description:
      "Implementa y mantén infraestructura cloud. Experiencia con AWS, Docker y CI/CD pipelines.",
    salaryMin: 5000000,
    salaryMax: 7000000,
    salaryCurrency: "COP",
    workType: "hybrid",
    lat: 4.656,
    lng: -74.058,
    locationLabel: "Parque 93, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "3+ años",
      documents: ["Certificaciones AWS"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-6",
    employerId: DEMO_EMPLOYER_ID,
    title: "Community Manager",
    description:
      "Gestiona nuestras redes sociales y comunidad digital. Creatividad y conocimiento de tendencias es clave.",
    salaryMin: 2000000,
    salaryMax: 3000000,
    salaryCurrency: "COP",
    workType: "remote",
    lat: null,
    lng: null,
    locationLabel: "Remoto",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "1+ años",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
];

export const demoApplications: DemoApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    candidateId: DEMO_CANDIDATE_ID,
    status: "pending",
    coverNote:
      "Me interesa mucho esta posición. Tengo 3 años de experiencia con React.",
    createdAt: new Date().toISOString(),
  },
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "notif-1",
    userId: DEMO_EMPLOYER_ID,
    type: "new_application",
    title: "Nueva postulación",
    body: "María González se postuló a \"Desarrollador Frontend React\"",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const demoMessages: DemoMessage[] = [];
