"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NavbarClient({ authenticated }: { authenticated?: boolean }) {
  const router = useRouter();

  if (!authenticated) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} title="Cerrar sesión">
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
