"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";

export function LanguagePicker() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        href="/id"
        onClick={() => sendGAEvent("event", "language_select", { language: "id" })}
        className="flex-1 border border-border rounded-lg px-6 py-4 hover:bg-secondary hover:border-foreground/20 transition-colors text-center"
      >
        <span className="block font-display text-base font-semibold">Bahasa Indonesia</span>
        <span className="block text-muted-foreground text-xs mt-0.5">Versi Indonesia</span>
      </Link>
      <Link
        href="/en"
        onClick={() => sendGAEvent("event", "language_select", { language: "en" })}
        className="flex-1 border border-border rounded-lg px-6 py-4 hover:bg-secondary hover:border-foreground/20 transition-colors text-center"
      >
        <span className="block font-display text-base font-semibold">English</span>
        <span className="block text-muted-foreground text-xs mt-0.5">English version</span>
      </Link>
    </div>
  );
}
