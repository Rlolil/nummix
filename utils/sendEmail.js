import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // 465 portu üçün true, 587 üçün false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password olmalıdır
      },
      tls: {
        rejectUnauthorized: false, // self-signed sertifikat üçün
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email göndərildi:", to);
  } catch (error) {
    console.error("Email göndərmə xətası:", error);
  }
};

export default sendEmail;
