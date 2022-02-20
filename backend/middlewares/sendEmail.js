const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    //mail trap
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e47e369d62f88e",
      pass: "144ef16827b4a5",
    },
  });

  const mailOptions = {
    from: e47e369d62f88e,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
