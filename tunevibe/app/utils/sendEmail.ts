// utils/sendEmail.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailData {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailData) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL as string, // Your verified SendGrid email
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    // console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
