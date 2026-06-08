import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    return NextResponse.json(
      { error: "Debes iniciar sesión como candidato" },
      { status: 401 }
    );
  }

  try {
    const { jobId, coverNote } = await req.json();

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile?.resumeUrl && !profile?.resumeLink) {
      return NextResponse.json(
        { error: "Completa tu hoja de vida antes de postularte" },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== "active") {
      return NextResponse.json(
        { error: "Empleo no disponible" },
        { status: 404 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId, candidateId: session.userId } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya te postulaste a este empleo" },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: session.userId,
        coverNote: coverNote || null,
      },
      include: {
        job: true,
        candidate: { include: { profile: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: job.employerId,
        type: "new_application",
        title: "Nueva postulación",
        body: `${profile.fullName} se postuló a "${job.title}"`,
        payload: JSON.stringify({
          applicationId: application.id,
          jobId,
          candidateId: session.userId,
        }),
      },
    });

    return NextResponse.json({ application });
  } catch {
    return NextResponse.json(
      { error: "Error al postularse" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");

  if (session.role === "candidate") {
    const applications = await prisma.application.findMany({
      where: { candidateId: session.userId },
      include: {
        job: {
          include: { employer: { include: { profile: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ applications });
  }

  if (session.role === "employer") {
    const where = jobId
      ? { job: { id: jobId, employerId: session.userId } }
      : { job: { employerId: session.userId } };

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: true,
        candidate: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ applications });
  }

  return NextResponse.json({ applications: [] });
}
