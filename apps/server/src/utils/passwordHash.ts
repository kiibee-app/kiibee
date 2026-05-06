import * as bcrypt from 'bcrypt';
import { env } from 'src/config/env';

export const hashPassword = async (
  password: string,
  saltRounds: number = env.BCRYPT_SALT_ROUNDS,
) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
