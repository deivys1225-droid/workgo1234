import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { status } = await req.json();
  if (!["accepted", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true, candidate: { include: { profile: true } } },
  });

  if (!application || application.job.employerId !== session.userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  const statusMessages: Record<string, string> = {
    accepted: "aceptada",
    rejected: "rechazada",
    pending: "pendiente",
  };

  await prisma.notification.create({
    data: {
      userId: application.candidateId,
      type: "application_update",
      title: "Actualización de postulación",
      body: `Tu postulación a "${application.job.title}" fue ${statusMessages[status]}`,
      payload: JSON.stringify({ applicationId: id, status }),
    },
  });

  return NextResponse.json({ application: updated });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

  if (!application) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const isEmployer = application.job.employerId === session.userId;
  const isCandidate = application.candidateId === session.userId;

  if (!isEmployer && !isCandidate) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json({ application });
}
