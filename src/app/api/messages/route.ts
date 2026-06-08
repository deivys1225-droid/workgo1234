import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApplication, addMessage, getUser } from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { applicationId, content } = await req.json();
  const application = getApplication(applicationId);
  if (!application) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const isEmployer = application.job?.employerId === session.userId;
  const isCandidate = application.candidateId === session.userId;
  if (!isEmployer && !isCandidate) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const message = addMessage({
    applicationId,
    senderId: session.userId,
    content,
  });

  return NextResponse.json({
    message: { ...message, sender: getUser(session.userId) },
  });
}
