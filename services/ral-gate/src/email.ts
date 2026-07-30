import { Resend } from "resend";
import { config, isMailConfigured } from "./config.js";

const resend = isMailConfigured ? new Resend(config.resendApiKey) : null;

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const subject = "Your RAL unlock code";
  const text = [
    `Your unlock code is ${code}.`,
    ``,
    `It expires in ${Math.round(config.otpTtlSeconds / 60)} minutes.`,
    `If you did not request this, ignore the email.`,
  ].join("\n");

  const html = `
    <div style="font-family:ui-monospace,Menlo,monospace;background:#08090A;color:#F4F2F0;padding:32px">
      <p style="letter-spacing:0.16em;text-transform:uppercase;color:#8CFF2E;font-size:12px">RAL disclosure</p>
      <h1 style="font-size:28px;margin:16px 0">Your unlock code</h1>
      <p style="font-size:36px;letter-spacing:0.3em;color:#8CFF2E;margin:24px 0">${code}</p>
      <p style="color:#9a9590;font-size:14px">Expires in ${Math.round(config.otpTtlSeconds / 60)} minutes. If you didn't ask for this, ignore the email.</p>
    </div>
  `;

  if (!resend) {
    console.log(`\n[ral-gate] DEV OTP for ${email}: ${code}\n`);
    return;
  }

  const result = await resend.emails.send({
    from: config.emailFrom,
    to: email,
    subject,
    text,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}
