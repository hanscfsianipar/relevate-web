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
          {i > 0 && <span className="text-border mx-0.5">/</span>}
          <button
            onClick={() => switchLocale(l)}
            className={cn(
              "px-1 py-0.5 rounded transition-colors uppercase text-xs tracking-wider",
              locale === l
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
