import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getNotifications, markNotificationsRead } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ notifications: getNotifications(session.userId) });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, markAllRead } = await req.json();
  if (markAllRead) {
    markNotificationsRead(session.userId);
  } else if (id) {
    markNotificationsRead(session.userId, id);
  }
  return NextResponse.json({ ok: true });
}
