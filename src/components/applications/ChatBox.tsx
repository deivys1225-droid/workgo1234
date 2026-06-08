"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  isOwn: boolean;
}

export function ChatBox({
  applicationId,
  messages: initialMessages,
}: {
  applicationId: string;
  messages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message.id,
            content,
            createdAt: new Date().toISOString(),
            senderId: data.message.senderId,
            senderName: "Tú",
            isOwn: true,
          },
        ]);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="flex flex-col p-4 h-[500px]">
      <h3 className="font-display font-semibold text-gray-900 mb-4">
        Mensajes
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No hay mensajes aún. Inicia la conversación.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.isOwn
                    ? "bg-primary-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {!msg.isOwn && (
                  <p className="text-xs font-medium opacity-70 mb-1">
                    {msg.senderName}
                  </p>
                )}
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200/80 bg-white/70 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
        />
        <Button type="submit" size="sm" loading={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </GlassCard>
  );
}
