import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const data = req.body;

    const { error } = await resend.emails.send({
      from: "Inflate Twenty-Eight Survey <onboarding@resend.dev>",
      to: ["Inflate Twenty-Eight <party@inflatetwentyeight.com>"],
      subject: `New survey response from ${data.name || "a customer"}`,
      html: `
        <h2>New Customer Feedback</h2>
        <p><strong>Name:</strong> ${data.name || ""}</p>
        <p><strong>Email:</strong> ${data.email || ""}</p>
        <p><strong>Event Date:</strong> ${data.event_date || ""}</p>
        <p><strong>Inflatable:</strong> ${data.inflatable || ""}</p>
        <p><strong>How Heard:</strong> ${data.how_heard || ""}</p>
        <p><strong>Overall Rating:</strong> ${data.rating_overall || ""}</p>
        <p><strong>Favorite:</strong> ${data.favorite || ""}</p>
        <p><strong>Improve:</strong> ${data.improve || ""}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ ok: false, error });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email function error:", error);
    return res.status(500).json({ ok: false, error });
  }
}