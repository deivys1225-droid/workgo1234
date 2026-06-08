import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDistanceMeters } from "@/lib/geo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || "4.711");
  const lng = parseFloat(searchParams.get("lng") || "-74.0721");
  const radius = parseFloat(searchParams.get("radius") || "50000");
  const workType = searchParams.get("workType");
  const search = searchParams.get("search");

  const jobs = await prisma.job.findMany({
    where: {
      status: "active",
      ...(workType && workType !== "all" ? { workType } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
              { locationLabel: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      employer: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const jobsWithDistance = jobs
    .map((job) => {
      let distance: number | undefined;
      if (job.lat && job.lng) {
        distance = getDistanceMeters(lat, lng, job.lat, job.lng);
      }
      return { ...job, distance };
    })
    .filter((job) => {
      if (job.workType === "remote") return true;
      if (job.distance === undefined) return true;
      return job.distance <= radius;
    })
    .sort((a, b) => {
      if (a.workType === "remote" && b.workType !== "remote") return 1;
      if (b.workType === "remote" && a.workType !== "remote") return -1;
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });

  return NextResponse.json({ jobs: jobsWithDistance });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const job = await prisma.job.create({
      data: {
        employerId: session.userId,
        title: body.title,
        description: body.description,
        salaryMin: body.salaryMin ? parseFloat(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseFloat(body.salaryMax) : null,
        salaryCurrency: body.salaryCurrency || "USD",
        workType: body.workType || "onsite",
        lat: body.lat ? parseFloat(body.lat) : null,
        lng: body.lng ? parseFloat(body.lng) : null,
        locationLabel: body.locationLabel,
        isApproximate: body.isApproximate || false,
        requirements: JSON.stringify(body.requirements || {}),
        imageUrl: body.imageUrl,
        status: "active",
      },
    });

    return NextResponse.json({ job });
  } catch {
    return NextResponse.json({ error: "Error al crear empleo" }, { status: 500 });
  }
}
