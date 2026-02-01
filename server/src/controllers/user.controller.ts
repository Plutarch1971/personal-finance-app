// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function register(req: Request, res: Response) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
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

   