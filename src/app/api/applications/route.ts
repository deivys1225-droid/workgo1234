import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser } from "@/lib/store";
import {
  getApplications,
  createApplication,
  getApplication,
  updateApplicationStatus,
} from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    return NextResponse.json({ error: "Debes entrar como candidato" }, { status: 401 });
  }

  const { jobId, coverNote } = await req.json();
  const profile = getUser(session.userId)?.profile;

  if (!profile?.resumeUrl && !profile?.resumeLink) {
    return NextResponse.json(
      { error: "Completa tu hoja de vida antes de postularte" },
      { status: 400 }
    );
  }

  const app = createApplication({
    jobId,
    candidateId: session.userId,
    coverNote,
  });

  if (!app) {
    return NextResponse.json({ error: "Ya te postulaste a este empleo" }, { status: 409 });
  }

  return NextResponse.json({ application: app });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const jobId = req.nextUrl.searchParams.get("jobId");

  if (session.role === "candidate") {
    return NextResponse.json({
      applications: getApplications({ candidateId: session.userId }),
    });
  }

  return NextResponse.json({
    applications: getApplications({
      employerId: session.userId,
      jobId: jobId || undefined,
    }),
  });
}
