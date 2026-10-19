/* eslint-disable @next/next/no-img-element */
import { Link } from "@/i18n/navigation";
import { clientLogos } from "@/lib/clients";
import { cn } from "@/lib/utils";

type Crumb = { label: string; body: string };

export function HomeHero({
  kicker,
  pre,
  accent,
  post,
  body,
  ctaPrimary,
  ctaSecondary,
  indexItems,
}: {
  kicker: string;
  pre: string;
  accent: string;
  post: string;
  body: string;
  ctaPrimary: string;
  ctaSecondary: string;
  indexItems: string[];
}) {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 pb-12 lg:px-14 lg:pt-28 lg:pb-14">
        <span className="kicker text-cream/60">{kicker}</span>
        <h1 className="font-display mt-6 max-w-[19ch] text-[clamp(38px,5.9vw,88px)]">
          {pre}
          <span className="text-lime">{accent}</span>
          {post}
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-cream/80">{body}</p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/contact"
              className="bg-lime px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:bg-[#8FB335]"
            >
              {ctaPrimary}
            </Link>
            <a
              href="#pendekatan"
              className="border border-cream/25 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream/10"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/20 pt-5 md:grid-cols-4">
          {indexItems.map((label, i) => (
            <div key={label}>
              <span className="block text-[11px] font-bold tracking-[0.16em] text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1.5 block text-[12.5px] font-bold uppercase tracking-[0.14em] text-cream/90">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClientMarquee({ title }: { title: string }) {
  const group = (
    <div className="flex items-center gap-[clamp(48px,7vw,110px)] pr-[clamp(48px,7vw,110px)]">
      {clientLogos.map(({ name, src, square }) => (
        <img
          key={name}
          src={src}
          alt={name}
          loading="lazy"
          className={cn(
            "w-auto shrink-0 opacity-75 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0",
            square ? "h-[clamp(44px,4.6vw,64px)]" : "h-[clamp(24px,2.5vw,34px)]"
          )}
        />
      ))}
    </div>
  );

  return (
    <section id="klien" className="border-b border-forest/15 bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
        <h2 className="font-display text-[clamp(28px,4.4vw,60px)]">{title}</h2>
      </div>
      <div className="marquee-mask mt-8 overflow-hidden lg:mt-11">
        <div className="marquee-track flex w-max">
          {group}
          <div aria-hidden="true">{group}</div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
  dark,
}: {
  kicker: string;
  title: string;
  lead: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div>
        <span className={cn("kicker", dark ? "text-cream/60" : "text-sage")}>{kicker}</span>
        <h2
          className={cn(
            "font-display mt-4 max-w-[18ch] text-[clamp(26px,3.9vw,56px)]",
            dark ? "text-cream" : "text-forest"
          )}
        >
          {title}
        </h2>
      </div>
      <p className={cn("max-w-[34ch] text-[15px]", dark ? "text-cream/70" : "text-sage")}>{lead}</p>
    </div>
  );
}

export function WhySection({
  kicker,
  title,
  lead,
  items,
}: {
  kicker: string;
  title: string;
  lead: string;
  items: Crumb[];
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
        <SectionHead kicker={kicker} title={title} lead={lead} />
        <div className="grid gap-x-12 md:grid-cols-2 lg:gap-x-20">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="grid grid-cols-[46px_1fr] gap-4 border-t border-forest/15 py-6"
            >
              <span className="text-[13px] font-bold tracking-[0.14em] text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[19px] font-bold leading-snug">{item.label}</h3>
                <p className="mt-1.5 max-w-[40ch] text-[14.5px] text-sage">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({
  kicker,
  title,
  lead,
  items,
}: {
  kicker: string;
  title: string;
  lead: string;
  items: Crumb[];
}) {
  return (
    <section id="layanan" className="bg-forest py-16 text-cream lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
        <SectionHead kicker={kicker} title={title} lead={lead} dark />
        <div className="border-t border-cream/20">
          {items.map((item, i) => (
            <Link
              key={item.label}
              href="/services"
              className="grid items-start gap-3 border-b border-cream/20 py-7 transition-colors hover:bg-cream/[0.03] md:grid-cols-[70px_1fr_1.1fr] md:gap-8 lg:py-9"
            >
              <span className="pt-1.5 text-[12px] font-bold tracking-[0.14em] text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[clamp(24px,3.1vw,42px)] text-cream">
                {item.label}
              </h3>
              <p className="max-w-[44ch] pt-1.5 text-[14.5px] text-cream/75">{item.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApproachSection({
  kicker,
  title,
  lead,
  steps,
  noteTitle,
  noteBody,
}: {
  kicker: string;
  title: string;
  lead: string;
  steps: Crumb[];
  noteTitle: string;
  noteBody: string;
}) {
  return (
    <section id="pendekatan" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
        <SectionHead kicker={kicker} title={title} lead={lead} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-9">
          {steps.map((step, i) => (
            <div key={step.label} className="border-t-2 border-forest pt-4">
              <b className="mb-3 block text-[clamp(24px,2.4vw,32px)] font-bold leading-none tracking-[-0.02em] text-lime">
                {String(i + 1).padStart(2, "0")}
              </b>
              <h4 className="mb-2 text-[15px] font-bold uppercase tracking-[0.1em]">
                {step.label}
              </h4>
              <p className="text-[13.5px] leading-relaxed text-sage">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 border-t border-forest/15 pt-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <p className="max-w-[30ch] text-[clamp(17px,2vw,24px)] font-semibold leading-snug tracking-[-0.01em]">
            {noteTitle}
          </p>
          <p className="max-w-[42ch] self-end text-[14.5px] text-sage">{noteBody}</p>
        </div>
      </div>
    </section>
  );
}

export function TeamSection({
  kicker,
  title,
  lead,
  members,
}: {
  kicker: string;
  title: string;
  lead: string;
  members: { name: string; role: string }[];
}) {
  return (
    <section id="tim" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
        <SectionHead kicker={kicker} title={title} lead={lead} />
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-9">
          {members.map(({ name, role }) => (
            <div key={name}>
              <div className="mb-4 grid aspect-square place-items-center bg-sand">
                <span className="text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em] text-forest/50">
                  {name.charAt(0)}
                </span>
              </div>
              <b className="block text-[17px] tracking-[-0.01em]">{name}</b>
              <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-sage">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  headline,
  body,
  button,
}: {
  headline: string;
  body: string;
  button: string;
}) {
  return (
    <section id="kontak" className="bg-lime text-forest">
      <div className="mx-auto grid max-w-[1320px] items-end gap-9 px-6 py-16 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-24">
        <div>
          <h2 className="font-display max-w-[18ch] text-[clamp(32px,5.4vw,78px)]">{headline}</h2>
          <p className="mt-4 max-w-[40ch] text-[15px] text-forest/80">{body}</p>
        </div>
        <Link
          href="/contact"
          className="bg-forest px-7 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-[#1A2620]"
        >
          {button}
        </Link>
      </div>
    </section>
  );
}
