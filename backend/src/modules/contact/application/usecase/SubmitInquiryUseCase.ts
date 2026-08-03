import { SubmitInquiryDTO } from "../dto/SubmitInquiryDTO";
import { AppError } from "../../../../shared/error/AppError";
import { ENV } from "../../../../shared/env/ENV";
import { sendMail } from "../../../../shared/mail/mailer";
import { mailTemplateForInquirySubmitted } from "../../../../shared/mail/template";

export class SubmitInquiryUseCase {
  async execute(input: SubmitInquiryDTO): Promise<void> {
    const recipient = ENV.EXAM_PASS_NOTIFICATION_EMAIL;

    if (!recipient) {
      throw new AppError("Missing notification email for inquiry", 500);
    }

    const fullName = input.fullName.trim();
    const email = input.email.trim();
    const phone = input.phone.trim();
    const subject = input.subject.trim();
    const message = input.message.trim();

    await sendMail({
      to: recipient,
      subject: `New Inquiry Submitted: ${subject}`,
      text: [
        "A new inquiry has been submitted.",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Subject: ${subject}`,
        `Message: ${message}`,
      ].join("\n"),
      html: mailTemplateForInquirySubmitted({
        fullName,
        email,
        phone,
        subject,
        message,
      }),
    });
  }
}
