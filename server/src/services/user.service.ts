import { User } from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// TODO: Implement user creation logic
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const hash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash: hash,
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email} });

  if(!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if(!valid) throw new Error( 'Invalid password');

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('No secret key defined');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1d' });

  return { user, token };
}
