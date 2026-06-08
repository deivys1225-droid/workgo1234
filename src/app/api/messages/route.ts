import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { applicationId, content } = await req.json();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const isEmployer = application.job.employerId === session.userId;
  const isCandidate = application.candidateId === session.userId;

  if (!isEmployer && !isCandidate) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      applicationId,
      senderId: session.userId,
      content,
    },
    include: { sender: { include: { profile: true } } },
  });

  const recipientId = isEmployer
    ? application.candidateId
    : application.job.employerId;

  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "new_message",
      title: "Nuevo mensaje",
      body: content.substring(0, 100),
      payload: JSON.stringify({ applicationId, messageId: message.id }),
    },
  });

  return NextResponse.json({ message });
}
