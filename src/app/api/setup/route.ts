import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-database";

const SETUP_KEY = process.env.SETUP_SECRET || "workgo2026";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (key !== SETUP_KEY) {
    return NextResponse.json(
      { error: "Clave incorrecta. Usa /setup para cargar los datos." },
      { status: 401 }
    );
  }

  try {
    const result = await seedDatabase(prisma);
    return NextResponse.json({
      ok: true,
      message: "Datos demo cargados correctamente",
      ...result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          "Error al cargar datos. Verifica que DATABASE_URL esté configurada.",
      },
      { status: 500 }
    );
  }
}
