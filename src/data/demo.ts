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
export const DEMO_EMPLOYER3_ID = "emp-3";
export const DEMO_EMPLOYER4_ID = "emp-4";
export const DEMO_CANDIDATE_ID = "cand-1";

export const demoUsers: DemoUser[] = [
  {
    id: DEMO_EMPLOYER_ID,
    email: "empleador@workgo.com",
    role: "employer",
    profile: {
      fullName: "Almacén La 14",
      companyName: "Almacén La 14",
      locationLabel: "Kennedy, Bogotá",
      lat: 4.628,
      lng: -74.148,
      bio: "Minimarket de barrio con venta al detal y bodega. Atendemos a la comunidad todos los días.",
      avatarUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
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
      bio: "Restaurante de comida casera y corrido. Buscamos gente con buena actitud y ganas de trabajar.",
      skills: "[]",
      experienceYears: 0,
    },
  },
  {
    id: DEMO_EMPLOYER3_ID,
    email: "servicios@workgo.com",
    role: "employer",
    profile: {
      fullName: "Servicios El Barrio",
      companyName: "Servicios El Barrio",
      locationLabel: "Suba, Bogotá",
      lat: 4.742,
      lng: -74.083,
      bio: "Empresa local de mantenimiento, jardinería y oficios varios para hogares y negocios.",
      avatarUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop",
      skills: "[]",
      experienceYears: 0,
    },
  },
  {
    id: DEMO_EMPLOYER4_ID,
    email: "moda@workgo.com",
    role: "employer",
    profile: {
      fullName: "Boutique El Estilo",
      companyName: "Boutique El Estilo",
      locationLabel: "Centro Comercial, Bogotá",
      lat: 4.653,
      lng: -74.064,
      bio: "Tienda de ropa para toda la familia en zona comercial. Venta al detal y atención personalizada.",
      avatarUrl:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
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
        "Atención al cliente",
        "Trabajo en equipo",
        "Caja y ventas",
        "Servicio en mesa",
        "Puntualidad",
      ]),
      experienceYears: 2,
      bio: "Busco empleo en comercio o restaurante. Tengo experiencia atendiendo clientes y trabajando en turnos.",
      resumeLink: "https://linkedin.com/in/mariagonzalez",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
  },
];

export const demoJobs: JobWithDistance[] = [
  {
    id: "job-1",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Mesero/a",
    description:
      "Restaurante de comida corrida busca mesero/a con buena actitud, puntualidad y ganas de aprender. Turnos de mañana y tarde. Propinas incluidas.",
    salaryMin: 1300000,
    salaryMax: 1800000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.6486,
    lng: -74.0628,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "Sin experiencia (se capacita)",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Chef de Cocina",
    description:
      "Buscamos chef de cocina con experiencia en comida casera e internacional. Organizar la cocina, preparar platos del menú y apoyar al equipo.",
    salaryMin: 2200000,
    salaryMax: 3200000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.65,
    lng: -74.061,
    locationLabel: "Zona G, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "2+ años",
      documents: ["Hoja de vida"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-3",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Ayudante de Cocina",
    description:
      "Apoyo en preparación de insumos, lavado de loza, organización del área y apoyo al chef. Ideal para quien quiere empezar en restaurantes.",
    salaryMin: 1200000,
    salaryMax: 1600000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.649,
    lng: -74.063,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "No requerida",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-4",
    employerId: DEMO_EMPLOYER_ID,
    title: "Auxiliar en Ventas",
    description:
      "Minimarket de barrio necesita auxiliar para atender clientes, organizar estantes, manejar caja básica y apoyar en inventario. Horario rotativo.",
    salaryMin: 1300000,
    salaryMax: 1700000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.628,
    lng: -74.148,
    locationLabel: "Kennedy, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "6 meses+ preferible",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-5",
    employerId: DEMO_EMPLOYER_ID,
    title: "Auxiliar de Bodega",
    description:
      "Recepción de mercancía, organización de bodega, despacho de pedidos y apoyo en conteos de inventario. Se valora fuerza y orden.",
    salaryMin: 1400000,
    salaryMax: 1900000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.629,
    lng: -74.146,
    locationLabel: "Kennedy, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "No requerida",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-6",
    employerId: DEMO_EMPLOYER3_ID,
    title: "Jardinero",
    description:
      "Mantenimiento de jardines en casas y locales comerciales: poda, riego, limpieza de zonas verdes y cuidado de plantas. Trabajo por zonas en Bogotá.",
    salaryMin: 1200000,
    salaryMax: 1700000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.742,
    lng: -74.083,
    locationLabel: "Suba, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "Conocimiento básico de jardinería",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-7",
    employerId: DEMO_EMPLOYER3_ID,
    title: "Oficios Varios",
    description:
      "Apoyo en arreglos menores, pintura, mantenimiento de locales, montaje de estanterías y trabajos generales. Ideal si sabes de herramientas y eres responsable.",
    salaryMin: 1300000,
    salaryMax: 2000000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.738,
    lng: -74.09,
    locationLabel: "Suba y localidades cercanas",
    isApproximate: true,
    requirements: JSON.stringify({
      resume: false,
      experience: "1+ año preferible",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-8",
    employerId: DEMO_EMPLOYER_ID,
    title: "Repartidor/a Local",
    description:
      "Entrega de pedidos del almacén en barrios cercanos. Se requiere bicicleta o moto propia, buena orientación y trato amable con clientes.",
    salaryMin: 1400000,
    salaryMax: 2000000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.631,
    lng: -74.15,
    locationLabel: "Kennedy, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "Conocer la zona",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-9",
    employerId: DEMO_EMPLOYER4_ID,
    title: "Vendedor/a de Ropa",
    description:
      "Tienda de ropa busca vendedor/a con buena presentación, trato amable y ganas de vender. Atención al cliente, organización de vitrinas y apoyo en caja.",
    salaryMin: 1300000,
    salaryMax: 1800000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.653,
    lng: -74.064,
    locationLabel: "Centro Comercial, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "6 meses+ preferible",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-10",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Administrador/a de Cafetería",
    description:
      "Cafetería de barrio necesita administrador/a para coordinar turnos, control de inventario, atención al cliente y apoyo en caja. Experiencia en restaurantes o cafés.",
    salaryMin: 1800000,
    salaryMax: 2500000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.647,
    lng: -74.065,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "1+ año",
      documents: ["Hoja de vida"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-11",
    employerId: DEMO_EMPLOYER_ID,
    title: "Guarda de Seguridad",
    description:
      "Minimarket requiere guarda de seguridad para turnos de día y noche. Control de acceso, rondas en el local y apoyo al personal. Se valora experiencia y responsabilidad.",
    salaryMin: 1500000,
    salaryMax: 2000000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.627,
    lng: -74.147,
    locationLabel: "Kennedy, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "1+ año preferible",
      documents: ["Hoja de vida", "Certificado de antecedentes"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-12",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Auxiliar de Cocina",
    description:
      "Cafetería busca auxiliar de cocina para apoyar en preparación de alimentos, montaje de platos, limpieza del área y apoyo al equipo. Turnos de mañana.",
    salaryMin: 1200000,
    salaryMax: 1600000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.651,
    lng: -74.06,
    locationLabel: "Chapinero, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "No requerida",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-13",
    employerId: DEMO_EMPLOYER2_ID,
    title: "Cocinera",
    description:
      "Restaurante de comida casera busca cocinera con experiencia en menús del día, sopas, almuerzos y organización de la cocina. Ambiente familiar y buen ambiente laboral.",
    salaryMin: 1800000,
    salaryMax: 2400000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.6495,
    lng: -74.0625,
    locationLabel: "Zona G, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: true,
      experience: "2+ años",
      documents: ["Hoja de vida"],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-14",
    employerId: DEMO_EMPLOYER3_ID,
    title: "Personal de Aseo",
    description:
      "Empresa de servicios busca personal de aseo para limpieza de locales comerciales, oficinas pequeñas y cafeterías. Horario de lunes a sábado. Se capacita.",
    salaryMin: 1200000,
    salaryMax: 1500000,
    salaryCurrency: "COP",
    workType: "onsite",
    lat: 4.74,
    lng: -74.085,
    locationLabel: "Suba, Bogotá",
    isApproximate: false,
    requirements: JSON.stringify({
      resume: false,
      experience: "No requerida",
      documents: [],
    }),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
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
      "Tengo experiencia atendiendo en restaurante y me interesa el puesto de mesero/a. Estoy disponible de inmediato.",
    createdAt: new Date().toISOString(),
  },
];

export const demoNotifications: DemoNotification[] = [
  {
    id: "notif-1",
    userId: DEMO_EMPLOYER2_ID,
    type: "new_application",
    title: "Nueva postulación",
    body: "María González se postuló a \"Mesero/a\"",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const demoMessages: DemoMessage[] = [];
