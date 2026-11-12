"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: string) => {
    // Remove current locale prefix and switch
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-0.5 text-sm font-medium">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-0.5 opacity-40">/</span>}
          <button
            onClick={() => switchLocale(l)}
            className={cn(
              "px-1 py-0.5 uppercase text-[11px] tracking-[0.14em] transition-opacity",
              locale === l
                ? "opacity-100 font-bold"
                : "opacity-55 hover:opacity-100"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
