import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApplication, updateApplicationStatus } from "@/lib/store";

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
  const application = getApplication(id);
  if (!application || application.job?.employerId !== session.userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const updated = updateApplicationStatus(id, status);
  return NextResponse.json({ application: updated });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const application = getApplication(id);
  if (!application) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const isEmployer = application.job?.employerId === session.userId;
  const isCandidate = application.candidateId === session.userId;
  if (!isEmployer && !isCandidate) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json({ application });
}
