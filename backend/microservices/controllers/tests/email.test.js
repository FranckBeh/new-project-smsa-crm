// tests/email.test.js

const nodemailer = require('nodemailer');

async function sendTestEmail() {
  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: 'noreply@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email from Node.js',
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Appel de la fonction pour tester l'envoi d'e-mails
sendTestEmail();
