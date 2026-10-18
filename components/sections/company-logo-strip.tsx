"use client";

import Image from "next/image";

/**
 * Strip logo klien / perusahaan.
 * GANTI: isi daftar di bawah dengan logo kamu sendiri.
 * Taruh file logo di public/logos/, lalu daftarkan di sini.
 * Array kosong = strip tidak ditampilkan, layout tetap rapi.
 */
const companies: {
  slug: string;
  name: string;
  logo: string | null;
  cls?: string;
  offsetY?: number;
}[] = [
  // Contoh format:
  // { slug: "contoh", name: "Contoh", logo: "/logos/contoh.png", cls: "grayscale opacity-50 mix-blend-multiply", offsetY: 0 },
];

interface CompanyLogoStripProps {
  label: string;
}

export function CompanyLogoStrip({ label }: CompanyLogoStripProps) {
  if (companies.length === 0) return null;

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
                className={`h-6 w-auto max-w-[110px] shrink-0 object-contain hover:opacity-80 transition-opacity ${cls ?? ""}`}
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
