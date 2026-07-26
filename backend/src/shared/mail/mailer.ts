import nodemailer from "nodemailer";
import { ENV } from "../env/ENV";
import { AppError } from "../error/AppError";

interface SendMailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (transporter) {
    return transporter;
  }

  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS || !ENV.SMTP_FROM) {
    throw new AppError(
      "Email service is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
      500,
    );
  }

  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendMail = async ({ to, subject, text, html }: SendMailPayload): Promise<void> => {
  const activeTransporter = getTransporter();

  await activeTransporter.sendMail({
    from: ENV.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
};
