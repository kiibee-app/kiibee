import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  saltRounds: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
