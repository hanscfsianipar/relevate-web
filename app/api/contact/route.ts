import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/site-config";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  message: z.string().min(20),
  budget: z.string().optional(),
  _trap: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data._trap) {
      return NextResponse.json({ success: true });
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Website Contact <onboarding@resend.dev>",
        to: siteConfig.contactEmail,
        subject: `Pesan baru dari ${data.name}`,
        html: `
          <h2>Pesan Baru dari Website</h2>
          <p><strong>Nama:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>Perusahaan:</strong> ${data.company}</p>` : ""}
          ${data.website ? `<p><strong>Website:</strong> ${data.website}</p>` : ""}
          ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ""}
          <p><strong>Pesan:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
        replyTo: data.email,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
