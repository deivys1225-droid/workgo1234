import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateUserProfile } from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Solo PDF" }, { status: 400 });
  }

  // Demo: simula subida con enlace ficticio
  const resumeUrl = `/uploads/demo-${session.userId}.pdf`;
  updateUserProfile(session.userId, { resumeUrl });

  return NextResponse.json({ resumeUrl });
}
