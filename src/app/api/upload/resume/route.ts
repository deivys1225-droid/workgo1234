import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Solo se permiten archivos PDF" },
        { status: 400 }
      );
    }

    let resumeUrl: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const filename = `resumes/${session.userId}-${Date.now()}.pdf`;
      const blob = await put(filename, file, {
        access: "public",
        contentType: "application/pdf",
      });
      resumeUrl = blob.url;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const filename = `${session.userId}-${Date.now()}.pdf`;
      await writeFile(path.join(uploadsDir, filename), buffer);
      resumeUrl = `/uploads/${filename}`;
    }

    await prisma.profile.update({
      where: { userId: session.userId },
      data: { resumeUrl },
    });

    return NextResponse.json({ resumeUrl });
  } catch {
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    );
  }
}
