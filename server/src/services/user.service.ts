import { User } from '../models';

export async function createUser(data: any) {
  // TODO: Implement user creation logic
  return User.create(data);
  
}

export async function findUserByEmail(email: string) {
  return User.findOne({ where: { email} });
}
