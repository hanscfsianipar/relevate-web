"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { sendGAEvent } from "@next/third-parties/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

const budgetOptions = {
  id: ["< Rp 5 juta", "Rp 5-15 juta", "Rp 15-30 juta", "> Rp 30 juta", "Belum tahu"],
  en: ["< $500", "$500–1,500", "$1,500–3,000", "> $3,000", "Not sure yet"],
};

const labels = {
  id: {
    name: "Nama",
    company: "Perusahaan",
    website: "Website",
    optional: "(opsional)",
    messagePlaceholder: "Ceritakan situasi dan tujuan Anda...",
    budgetSelect: "Pilih kisaran anggaran",
    responseNote: "Kami biasanya merespons dalam 24 jam.",
    serverError: "Terjadi kesalahan. Coba lagi atau email langsung ke hello@relevate.id",
  },
  en: {
    name: "Name",
    company: "Company",
    website: "Website",
    optional: "(optional)",
    messagePlaceholder: "Tell us about your situation and goals...",
    budgetSelect: "Select a budget range",
    responseNote: "We usually respond within 24 hours.",
    serverError: "Something went wrong. Please try again or email hello@relevate.id directly",
  },
};

function createSchema(locale: string) {
  const isEn = locale === "en";
  return z.object({
    name: z.string().min(2, isEn ? "Name must be at least 2 characters" : "Nama minimal 2 karakter"),
    email: z.string().email(isEn ? "Invalid email format" : "Format email tidak valid"),
    company: z.string().optional(),
    website: z.string().url(isEn ? "Invalid URL format" : "Format URL tidak valid").optional().or(z.literal("")),
    message: z.string().min(20, isEn ? "Message must be at least 20 characters" : "Pesan minimal 20 karakter"),
    budget: z.string().optional(),
  });
}

type FormData = {
  name: string;
  email: string;
  company?: string;
  website?: string;
  message: string;
  budget?: string;
  _trap?: string;
};

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const resolver = useMemo(() => zodResolver(createSchema(locale)), [locale]);
  const l = locale === "en" ? labels.en : labels.id;
  const opts = locale === "en" ? budgetOptions.en : budgetOptions.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      sendGAEvent("event", "contact_initiated", {
        locale,
        budget: data.budget ?? "not_specified",
      });
      setSubmitted(true);
    } catch {
      setServerError(l.serverError);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="font-bricolage text-lg font-bold mb-1">{t("successMessage")}</p>
          <p className="text-sm text-muted-foreground">{l.responseNote}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
        <input {...register("_trap")} type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {l.name} <span className="text-destructive">*</span>
          </label>
          <input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{l.company}</label>
          <input
            {...register("company")}
            placeholder={t("companyPlaceholder")}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{l.website}</label>
          <input
            {...register("website")}
            placeholder={t("websitePlaceholder")}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
          {errors.website && (
            <p className="text-xs text-destructive mt-1">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          {t("messagePlaceholder")} <span className="text-destructive">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder={l.messagePlaceholder}
          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t("budgetLabel")} {l.optional}</label>
        <select
          {...register("budget")}
          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <option value="">{l.budgetSelect}</option>
          {opts.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {serverError && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
