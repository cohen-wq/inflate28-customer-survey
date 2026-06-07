import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_EMAIL = process.env.ALERT_EMAIL || "cohen.p.blanchard@gmail.com";

if (!RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email sending will fail until it's configured.");
}

const resend = new Resend(RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const data = req.body || {};

    // Accept camelCase (frontend) and snake_case variants if provided
    const name = data.name || data.full_name || "";
    const email = data.email || "";
    const event_date = data.eventDate || data.event_date || "";
    const inflatable = data.inflatable || "";
    const how_heard = data.howHeard || data.how_heard || "";
    const rating_overall = data.ratingOverall || data.rating_overall || "";
    const favorite = data.favorite || "";
    const improve = data.improve || "";
    const improveSkills = data.improveSkills || data.improve_skills || "";

    const html = `
      <h2>New Customer Feedback</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Event Date:</strong> ${escapeHtml(event_date)}</p>
      <p><strong>Inflatable:</strong> ${escapeHtml(inflatable)}</p>
      <p><strong>How Heard:</strong> ${escapeHtml(how_heard)}</p>
      <p><strong>Overall Rating:</strong> ${escapeHtml(String(rating_overall))}</p>
      <p><strong>Favorite:</strong> ${escapeHtml(favorite)}</p>
      <p><strong>Improve:</strong> ${escapeHtml(improve)}</p>
      <p><strong>Improve (skills):</strong> ${escapeHtml(improveSkills)}</p>
    `;

    await resend.emails.send({
      from: "Inflate Twenty-Eight Survey <onboarding@resend.dev>",
      to: [ALERT_EMAIL],
      subject: `New survey response from ${name || "a customer"}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email function error:", error);
    return res.status(500).json({ ok: false, error: String(error) });
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}