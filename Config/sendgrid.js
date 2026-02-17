const sgMail = require('@sendgrid/mail');
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sendEmail function
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: { email: process.env.SENDGRID_SENDER_EMAIL, name: "Your App Name" }, // ✅ fixed
    subject,
    text,
    html,
  };
  await sgMail.send(msg);
};

module.exports = { sendEmail };
