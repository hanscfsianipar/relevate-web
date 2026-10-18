"use client";

import Image from "next/image";

const companies = [
  // transparent-bg logos: use brightness-0 so light/grey pixels become black
  { slug: "vidio",    name: "MediaCo",    logo: "/logos/vidio.png",    cls: "brightness-0 opacity-35",                              offsetY: 0 },
  { slug: "shopback", name: "EcomCo", logo: "/logos/shopback.svg", cls: "grayscale opacity-50 mix-blend-multiply",              offsetY: 0 },
  // stacked icon+text logos: offsetY shifts image up so wordmark aligns with text logos
  { slug: "bareksa",  name: "FintechCo",  logo: "/logos/bareksa2.png", cls: "grayscale opacity-50 mix-blend-multiply !max-w-[80px]", offsetY: -6 },
  { slug: "lamudi",   name: "ProptechCo",   logo: "/logos/lamudi.png",   cls: "grayscale opacity-50 mix-blend-multiply !max-w-[80px]", offsetY: -5 },
  { slug: "ruparupa", name: "RetailCo", logo: "/logos/ruparupa.png", cls: "grayscale opacity-50 mix-blend-multiply",              offsetY: 0 },
  { slug: "wadezig",  name: "AgencyCo",  logo: "/logos/wadezig.jpg",  cls: "grayscale opacity-40 mix-blend-multiply",              offsetY: 0 },
  { slug: "pinnacle", name: "ClientCo", logo: null,                  cls: "",                                                      offsetY: 0 },
];

interface CompanyLogoStripProps {
  label: string;
}

export function CompanyLogoStrip({ label }: CompanyLogoStripProps) {
  return (
    <div className="border-y border-border py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
          {label}
        </p>
        <div className="flex items-center justify-start sm:justify-center gap-10 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {companies.map(({ slug, name, logo, cls, offsetY }) =>
            logo ? (
              <Image
                key={slug}
                src={logo}
                alt={name}
                width={200}
                height={40}
                className={`h-6 w-auto max-w-[110px] shrink-0 object-contain hover:opacity-80 transition-opacity ${cls}`}
                style={offsetY ? { transform: `translateY(${offsetY}px)` } : undefined}
              />
            ) : (
              <span
                key={slug}
                className="shrink-0 text-sm font-semibold text-muted-foreground/50 hover:text-muted-foreground/75 transition-colors tracking-tight"
              >
                {name}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
