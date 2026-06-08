import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getJobs, createJob } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const jobs = getJobs({
    lat: parseFloat(searchParams.get("lat") || "4.711"),
    lng: parseFloat(searchParams.get("lng") || "-74.0721"),
    radius: parseFloat(searchParams.get("radius") || "50000"),
    workType: searchParams.get("workType") || undefined,
    search: searchParams.get("search") || undefined,
  });
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const job = createJob({
    employerId: session.userId,
    title: body.title,
    description: body.description,
    salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
    salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
    salaryCurrency: body.salaryCurrency || "COP",
    workType: body.workType || "onsite",
    lat: body.lat ? parseFloat(body.lat) : null,
    lng: body.lng ? parseFloat(body.lng) : null,
    locationLabel: body.locationLabel,
    isApproximate: false,
    requirements: JSON.stringify(body.requirements || {}),
    imageUrl: body.imageUrl || null,
    status: "active",
  });

  return NextResponse.json({ job });
}
