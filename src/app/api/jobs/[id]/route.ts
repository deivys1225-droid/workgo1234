import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getJob, getStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "4.711");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") || "-74.0721");
  const job = getJob(id, lat, lng);
  if (!job) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const job = getJob(id);
  if (!job || job.employerId !== session.userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const storeJob = getStore().jobs.find((j) => j.id === id);
  if (storeJob && body.status) storeJob.status = body.status;

  return NextResponse.json({ job: storeJob });
}
