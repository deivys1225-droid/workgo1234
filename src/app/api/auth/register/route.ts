import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getUser } from "@/lib/store";
import { DEMO_CANDIDATE_ID, DEMO_EMPLOYER_ID } from "@/data/demo";

export async function POST(req: Request) {
  const { role } = await req.json();
  const userId = role === "employer" ? DEMO_EMPLOYER_ID : DEMO_CANDIDATE_ID;
  const user = getUser(userId);
  if (!user) return NextResponse.json({ error: "Error" }, { status: 404 });

  await createSession({
    userId: user.id,
    email: user.email,
    fullName: user.profile.fullName,
    role: user.role,
  });

  return NextResponse.json({ user: { id: user.id, role: user.role } });
}
