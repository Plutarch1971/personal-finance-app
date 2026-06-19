import transporter from '../config/email';

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'SmartBooks Password Reset',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below:</p>
      <a href="${resetLink}">
        Reset Password
      </a>
    `
  });

};