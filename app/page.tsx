import { Bricolage_Grotesque, Inter } from "next/font/google";
import Image from "next/image";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LanguagePicker } from "@/components/language-picker";
import { getHomePage } from "@/lib/sanity/queries";

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
  title: "Hans — SEO & Marketing Analytics",
  description: "Pilih bahasa / Choose your language",
};

export default async function RootPage() {
  const sanity = await getHomePage()
  const taglineId = sanity?.id?.rootTagline ?? 'Strategi berbasis data, cerita yang bermakna.'
  const taglineEn = sanity?.en?.rootTagline ?? 'Data-driven strategy, meaningful storytelling.'

  return (
    <html
      lang="und"
      className={`${inter.variable} ${bricolage.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <main className="text-center max-w-sm w-full space-y-10">

          <div>
            <p className="font-display text-5xl font-bold tracking-tight">
              Hans<span className="text-accent">.</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              SEO & Marketing Analytics
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

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
              Lintas industri / Across industries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              {[
                { name: "Vidio",    logo: "/logos/vidio.png",    cls: "brightness-0 opacity-35",                              offsetY: 0 },
                { name: "ShopBack", logo: "/logos/shopback.svg", cls: "grayscale opacity-50 mix-blend-multiply",              offsetY: 0 },
                { name: "Bareksa",  logo: "/logos/bareksa2.png", cls: "grayscale opacity-50 mix-blend-multiply !max-w-[80px]", offsetY: -5 },
                { name: "Lamudi",   logo: "/logos/lamudi.png",   cls: "grayscale opacity-50 mix-blend-multiply !max-w-[80px]", offsetY: -5 },
                { name: "Ruparupa", logo: "/logos/ruparupa.png", cls: "grayscale opacity-50 mix-blend-multiply",              offsetY: 0 },
                { name: "Wadezig",  logo: "/logos/wadezig.jpg",  cls: "grayscale opacity-40 mix-blend-multiply",              offsetY: 0 },
                { name: "Pinnacle", logo: null,                  cls: "",                                                      offsetY: 0 },
              ].map(({ name, logo, cls, offsetY }) =>
                logo ? (
                  <Image
                    key={name}
                    src={logo}
                    alt={name}
                    width={200}
                    height={40}
                    className={`h-5 w-auto max-w-[90px] object-contain ${cls}`}
                    style={offsetY ? { transform: `translateY(${offsetY}px)` } : undefined}
                  />
                ) : (
                  <span key={name} className="text-xs font-semibold text-muted-foreground/40 tracking-tight">
                    {name}
                  </span>
                )
              )}
            </div>
          </div>

        </main>
      </body>
      <GoogleAnalytics gaId="G-RK7LMXHXSY" />
    </html>
  );
}
