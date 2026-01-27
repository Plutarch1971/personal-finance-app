// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../services/user.service';

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Sign JWT token
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 4. Return token + user info (omit password)
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
