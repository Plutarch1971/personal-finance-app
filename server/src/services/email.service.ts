import resend from '../config/email';

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {

  await resend.emails.send({
    from: 'SmartBooks. <noreply@smartbooksfinance.com>',
    to: email,
    subject: 'SmartBooks Password Reset',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `
  });

};