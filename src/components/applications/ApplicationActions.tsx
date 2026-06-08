"use client";

import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ApplicationActions({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();

  async function updateStatus(status: "accepted" | "rejected") {
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="mt-6 flex gap-3 border-t border-gray-200/50 pt-6">
      <Button
        className="flex-1 gap-2"
        onClick={() => updateStatus("accepted")}
      >
        <Check className="h-4 w-4" />
        Aceptar
      </Button>
      <Button
        variant="danger"
        className="flex-1 gap-2"
        onClick={() => updateStatus("rejected")}
      >
        <X className="h-4 w-4" />
        Rechazar
      </Button>
    </div>
  );
}
