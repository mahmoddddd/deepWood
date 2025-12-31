const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID, // Updated variable name
      pass: process.env.PASS_MAIL, // Updated variable name
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Deep Wood'} <${process.env.MAIL_ID}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
