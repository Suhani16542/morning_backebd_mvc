const sgMail = require('@sendgrid/mail');
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendEmail - Send email via SendGrid
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = {
      to,
      from: { email: process.env.SENDGRID_SENDER_EMAIL, name: "Your App Name" }, // ✅ corrected
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    // Print full SendGrid error
    console.error("SENDGRID FULL ERROR >>>", err.response?.body || err.message);

    // Do NOT throw to prevent OTP API crash
    // Optional: return false if you want to handle in controller
    return false;
  }
};

module.exports = { sendEmail };
