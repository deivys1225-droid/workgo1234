import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = getUser(session.userId);
  return NextResponse.json({
    user: user
      ? { id: user.id, email: user.email, role: user.role, profile: user.profile }
      : { id: session.userId, email: session.email, role: session.role },
  });
}
