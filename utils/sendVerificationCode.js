import sendEmail from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";

export const sendVerificationCode = async (user, code) => {
  const message = generateVerificationOtpEmailTemplate(code);
  await sendEmail({
    email: user.email,
    subject: "Verify Your Account - Library Management",
    message,
  });
};
