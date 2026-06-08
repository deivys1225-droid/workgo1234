import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getUser, getUserByEmail } from "@/lib/store";
import { DEMO_CANDIDATE_ID, DEMO_EMPLOYER_ID } from "@/data/demo";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!["employer", "candidate"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    const user =
      role === "employer"
        ? getUser(DEMO_EMPLOYER_ID)
        : getUser(DEMO_CANDIDATE_ID);

    if (!user) {
      return NextResponse.json({ error: "Usuario demo no encontrado" }, { status: 404 });
    }

    await createSession({
      userId: user.id,
      email: user.email,
      fullName: user.profile.fullName,
      role: user.role,
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch {
    return NextResponse.json({ error: "Error al entrar" }, { status: 500 });
  }
}

// Compatibilidad con login antiguo por email (demo)
export async function PUT(req: NextRequest) {
  const { email } = await req.json();
  const user = getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  await createSession({
    userId: user.id,
    email: user.email,
    fullName: user.profile.fullName,
    role: user.role,
  });
  return NextResponse.json({ user: { id: user.id, role: user.role } });
}
