// src/controllers/user.controller.ts
import { User } from '../models';
import { Request, Response } from 'express';
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

//------------------------- FORGOT PASSWORD CONTROLLER ---------------------//
export const forgotPassword = async ( req: Request, res: Response) => {
  try {
    console.log('Forgot password route hit');
    console.log('Forgot password request:', req.body);
    const { email } = req.body;

    await userService.forgotPassword(email);
    

    return res.status(200).json({
      message: 'If the email exists, a reset link has been sent.'
    });
  } catch (error) {
    console.error(error);

      return res.status(500).json({
        message: 'Server error'
      });
  }
};
  

//---------------------- RESET PASSWORD CONTROLLER--------------------------//
export const resetPassword = async ( req: Request, res: Response) => {
  try {
  const { token } = req.params;
  const { password } = req.body;

  await userService.resetPassword(token as string, password); //cast { token } to string
  return res.status(200).json({
    message: 'Password reset successful'
  });
 } catch (error) {
  if (
    error instanceof Error &&
    error.message === 'INVALID_TOKEN'
  ) {
     return res.status(400).json({
      message: 'Ivalid token'
     });
  }
  if (
    error instanceof Error &&
    error.message === 'TOKEN_EXPIRED'
  ) {
     return res.status(400).json({
      message: 'Token expired'
     });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Server error'
  });
 }
};