import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const employer = await prisma.user.upsert({
    where: { email: "empleador@workgo.com" },
    update: {},
    create: {
      email: "empleador@workgo.com",
      passwordHash,
      role: "employer",
      profile: {
        create: {
          fullName: "TechCorp Colombia",
          companyName: "TechCorp Colombia",
          locationLabel: "Bogotá, Colombia",
          lat: 4.6533,
          lng: -74.0836,
          bio: "Empresa de tecnología líder en soluciones digitales.",
          avatarUrl:
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
        },
      },
    },
  });

  const employer2 = await prisma.user.upsert({
    where: { email: "restaurante@workgo.com" },
    update: {},
    create: {
      email: "restaurante@workgo.com",
      passwordHash,
      role: "employer",
      profile: {
        create: {
          fullName: "Sabores del Valle",
          companyName: "Sabores del Valle",
          locationLabel: "Chapinero, Bogotá",
          lat: 4.6486,
          lng: -74.0628,
          bio: "Restaurante gourmet con enfoque local.",
        },
      },
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: "candidato@workgo.com" },
    update: {},
    create: {
      email: "candidato@workgo.com",
      passwordHash,
      role: "candidate",
      profile: {
        create: {
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
    },
  });

  const candidate2 = await prisma.user.upsert({
    where: { email: "carlos@workgo.com" },
    update: {},
    create: {
      email: "carlos@workgo.com",
      passwordHash,
      role: "candidate",
      profile: {
        create: {
          fullName: "Carlos Mendoza",
          locationLabel: "Usaquén, Bogotá",
          lat: 4.6951,
          lng: -74.0305,
          skills: JSON.stringify([
            "Atención al cliente",
            "Cocina",
            "Liderazgo",
            "Inventarios",
          ]),
          experienceYears: 5,
          bio: "Chef con experiencia en cocina internacional y gestión de equipos.",
          resumeLink: "https://linkedin.com/in/carlosmendoza",
        },
      },
    },
  });

  const jobs = [
    {
      employerId: employer.id,
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
      requirements: JSON.stringify({
        resume: true,
        experience: "2+ años",
        documents: ["Hoja de vida"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    },
    {
      employerId: employer.id,
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
      requirements: JSON.stringify({
        resume: true,
        experience: "1+ años",
        documents: ["Portafolio"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
    },
    {
      employerId: employer2.id,
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
      requirements: JSON.stringify({
        resume: true,
        experience: "3+ años",
        documents: ["Certificaciones"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    },
    {
      employerId: employer2.id,
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
      requirements: JSON.stringify({
        resume: false,
        experience: "6 meses+",
        documents: [],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    },
    {
      employerId: employer.id,
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
      requirements: JSON.stringify({
        resume: true,
        experience: "3+ años",
        documents: ["Certificaciones AWS"],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    },
    {
      employerId: employer.id,
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
      requirements: JSON.stringify({
        resume: true,
        experience: "1+ años",
        documents: [],
      }),
      imageUrl:
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
    },
  ];

  for (const jobData of jobs) {
    const existing = await prisma.job.findFirst({
      where: { title: jobData.title, employerId: jobData.employerId },
    });
    if (!existing) {
      await prisma.job.create({ data: jobData });
    }
  }

  const frontendJob = await prisma.job.findFirst({
    where: { title: "Desarrollador Frontend React" },
  });

  if (frontendJob) {
    const existingApp = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: frontendJob.id,
          candidateId: candidate.id,
        },
      },
    });

    if (!existingApp) {
      await prisma.application.create({
        data: {
          jobId: frontendJob.id,
          candidateId: candidate.id,
          status: "pending",
          coverNote:
            "Me interesa mucho esta posición. Tengo 3 años de experiencia con React.",
        },
      });
    }
  }

  console.log("✅ Seed completed!");
  console.log("\n📧 Demo accounts:");
  console.log("  Empleador: empleador@workgo.com / demo1234");
  console.log("  Candidato: candidato@workgo.com / demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
