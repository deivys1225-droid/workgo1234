import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDistanceMeters } from "@/lib/geo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "4.711");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") || "-74.0721");

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { include: { profile: true } },
      applications: { select: { id: true, candidateId: true, status: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Empleo no encontrado" }, { status: 404 });
  }

  let distance: number | undefined;
  if (job.lat && job.lng) {
    distance = getDistanceMeters(lat, lng, job.lat, job.lng);
  }

  return NextResponse.json({ job: { ...job, distance } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.employerId !== session.userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.job.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.status && { status: body.status }),
      ...(body.salaryMin !== undefined && {
        salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
      }),
      ...(body.salaryMax !== undefined && {
        salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
      }),
    },
  });

  return NextResponse.json({ job: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.employerId !== session.userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
