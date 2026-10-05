import 'dotenv/config';
import * as nodemailer from 'nodemailer';

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log(
      `Connecting to SMTP server ${process.env.SMTP_HOST} with user ${process.env.SMTP_USER}...`,
    );
    await transporter.verify();
    console.log(
      '✅ Connection verified successfully! Your App Password is correct.',
    );

    console.log('Sending test email to muksanaakter3@gmail.com...');
    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: 'muksanaakter3@gmail.com',
      subject: 'Kiibee - SMTP Configuration Test',
      html: '<b>Hello!</b> Your SMTP credentials are working perfectly.',
    });

    console.log('✅ Email sent successfully! Message ID: %s', info.messageId);
  } catch (error) {
    console.error('❌ Failed to connect or send email:', error.message);
  }
}

main();
