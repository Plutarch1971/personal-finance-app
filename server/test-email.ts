import transporter from './src/config/email';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

async function testEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'matthewpmendez@gmail.com',
      subject: 'SmartBooks Test',
      text: 'Test email'
    });

    console.log('Email sent');
  } catch (err) {
    console.error(err);
  }
}

testEmail();