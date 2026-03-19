import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? "noreply@example.com";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  if (!apiKey) {
    console.warn("[SendGrid] SENDGRID_API_KEY not set — email not sent to:", to);
    return { success: false, error: "SendGrid API key not configured." };
  }

  try {
    await sgMail.send({ to, from: fromEmail, subject, html });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown SendGrid error";
    console.error("[SendGrid] Failed to send email:", message);
    return { success: false, error: message };
  }
}
