import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  headline: string;
  cta: string;
  href: string;
}

export function CtaBanner({ headline, cta, href }: CtaBannerProps) {
  return (
    <section className="py-20 md:py-28 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-foreground text-background px-8 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="font-bricolage text-2xl sm:text-3xl font-bold tracking-tight max-w-lg">
            {headline}
          </h2>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="shrink-0 gap-2"
          >
            <Link href={href as Parameters<typeof Link>[0]["href"]}>
              {cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
