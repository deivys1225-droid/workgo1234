import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser, updateUserProfile } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const profile = getUser(session.userId)?.profile;
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const profile = updateUserProfile(session.userId, {
    ...(body.fullName && { fullName: body.fullName }),
    ...(body.phone !== undefined && { phone: body.phone }),
    ...(body.lat !== undefined && { lat: body.lat ? parseFloat(body.lat) : null }),
    ...(body.lng !== undefined && { lng: body.lng ? parseFloat(body.lng) : null }),
    ...(body.locationLabel !== undefined && { locationLabel: body.locationLabel }),
    ...(body.skills && { skills: JSON.stringify(body.skills) }),
    ...(body.experienceYears !== undefined && {
      experienceYears: parseInt(body.experienceYears) || 0,
    }),
    ...(body.bio !== undefined && { bio: body.bio }),
    ...(body.resumeUrl !== undefined && { resumeUrl: body.resumeUrl }),
    ...(body.resumeLink !== undefined && { resumeLink: body.resumeLink }),
    ...(body.companyName !== undefined && { companyName: body.companyName }),
  });

  return NextResponse.json({ profile });
}
