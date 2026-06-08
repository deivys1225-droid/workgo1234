"use client";

import { useEffect } from "react";

export function CapacitorInit() {
  useEffect(() => {
    async function initNativeShell() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch {
        // Web or plugin unavailable — safe-area CSS handles layout.
      }
    }

    void initNativeShell();
  }, []);

  return null;
}
