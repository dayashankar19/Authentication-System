const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    });
    console.log(`Email successfully send to ${to}`);
  } catch (err) {
    console.error("Failed to send email", err);
    throw new Error("Error sending email");
  }
};
module.exports = sendEmail;
