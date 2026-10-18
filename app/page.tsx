import { Bricolage_Grotesque, Inter } from "next/font/google";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LanguagePicker } from "@/components/language-picker";
import { getHomePage } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.brand} - ${siteConfig.tagline.en}`,
  description: "Pilih bahasa / Choose your language",
};

export default async function RootPage() {
  const sanity = await getHomePage()
  const taglineId = sanity?.id?.rootTagline ?? 'Strategi berbasis data, cerita yang bermakna.'
  const taglineEn = sanity?.en?.rootTagline ?? 'Data-driven strategy, meaningful storytelling.'
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      lang="und"
      className={`${inter.variable} ${bricolage.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <main className="text-center max-w-sm w-full space-y-10">

          <div>
            <p className="font-display text-5xl font-bold tracking-tight">
              {siteConfig.brand}
              <span className="text-accent">{siteConfig.wordmarkSuffix}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {siteConfig.tagline.en}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-base">{taglineId}</p>
            <p className="text-muted-foreground text-sm">
              {taglineEn}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Pilih bahasa / Choose language
            </p>
            <LanguagePicker />
          </div>

        </main>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
