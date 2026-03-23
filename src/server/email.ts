import nodemailer from "nodemailer";
import { env } from "@/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"Chatcord" <${env.EMAIL_USER}>`,
    to,
    subject: "Confirm your Email",
    text: `Your confirmation code is: ${code}`,
  });
}
