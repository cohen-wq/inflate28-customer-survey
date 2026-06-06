import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await req.json();

    const {
      name,
      email,
      event_date,
      inflatable,
      how_heard,
      rating_overall,
      favorite,
      improve,
    } = data;

    await resend.emails.send({
      from: "Inflate Twenty-Eight Survey <onboarding@resend.dev>",
      to: ["party@inflatetwentyeight.com"],
      subject: `New survey response from ${name || "a customer"}`,
      html: `
        <h2>New Customer Feedback</h2>
        <p><strong>Name:</strong> ${name || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Event Date:</strong> ${event_date || ""}</p>
        <p><strong>Inflatable:</strong> ${inflatable || ""}</p>
        <p><strong>How Heard:</strong> ${how_heard || ""}</p>
        <p><strong>Overall Rating:</strong> ${rating_overall || ""}</p>
        <p><strong>Favorite:</strong> ${favorite || ""}</p>
        <p><strong>Improve:</strong> ${improve || ""}</p>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Email function error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}