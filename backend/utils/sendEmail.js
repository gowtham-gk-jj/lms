const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "092778b0a9c8b2", // Paste from Mailtrap
      pass: "dc1975f445fc82"  // Paste from Mailtrap
    }
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html (optional if you want fancy formatting)
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;