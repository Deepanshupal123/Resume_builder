const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendResetEmail = async (to, resetUrl) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('SMTP not configured. Reset link generated:', resetUrl);
    return {
      ok: true,
      fallback: true,
      message: 'Reset link generated in development mode. Configure SMTP to send email automatically.',
      resetUrl,
    };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@executiveslate.com',
    to,
    subject: 'Reset your Executive Slate password',
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your password for Executive Slate.</p>
      <p><a href="${resetUrl}" target="_blank" rel="noreferrer">Click here to reset your password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  return { ok: true, fallback: false };
};

module.exports = { sendResetEmail };
