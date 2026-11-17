import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * "/" tidak lagi menampilkan popup pilih bahasa.
 * Bahasa dipilih otomatis dari preferensi browser:
 * Indonesia -> /id, selain itu -> /en.
 */

type Pref = { base: string; q: number };

function parseAcceptLanguage(header: string | null): Pref[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return {
        base: rawTag.trim().toLowerCase().split("-")[0],
        q: Number.isFinite(q) ? q : 1,
      };
    })
    .filter((pref) => pref.base.length > 0)
    .sort((a, b) => b.q - a.q);
}

function pickLocale(header: string | null): "id" | "en" {
  for (const { base, q } of parseAcceptLanguage(header)) {
    if (q === 0) continue;
    if (base === "id") return "id";
    if (base === "en") return "en";
  }
  return "en";
}

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const requestHeaders = await headers();
  const locale = pickLocale(requestHeaders.get("accept-language"));
  redirect(`/${locale}`);
}
