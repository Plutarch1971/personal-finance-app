// src/controllers/user.controller.ts
import { User } from '../models';
import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import transporter from '../utils/email';
import * as userService from '../services/user.service';

export async function register(req: Request, res: Response) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email});
  } catch (err: any) {
    res.status(400).json( { error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await userService.loginUser(
      req.body.email,
      req.body.password
    );
    res.json(result);
  } catch (err: any) {
    res.status(401).json( { error: err.message});
  }
}

export const forgotPassword = async ( req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email}
  });
  if (!user) {
    return res.status(200).json({
      message: 'If the email exists, a reset link has been sent.'
    });
  }

  const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;

    user.resetPasswordExpires = 
         new Date(Date.now() + 3600000);
         await user.save();

         const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${token}`;

            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: 'SmartBooks password reset',
              html: `
                <h2>Password Reset</h2>
                <p>Click below: </p>
                <a href="${resetLink}">
                Reset Password
                </a>
                `
            });

            return res.status(200).json({
              message: 'Reset email sent'
            });

};

export const resetPassword = async(req: Request, res: Response) => {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        where: {
          resetPasswordToken: token
         }
      });

      if (!user) {
        return res.status(400).json({
          message: 'Invalid token'
        });
      }

      if (
        !user.resetPasswordExpires || 
      user.resetPasswordExpires < new Date() 
      ) {
        return res.status(400).json({
          message: 'Token expired'
        });
      }

      const hash = 
          await bcrypt.hash(password, 10);
          user.passwordHash = hash;

          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;

          await user.save();

          return res.status(200).json({
            message: 'Password reset successful'
          });
};

