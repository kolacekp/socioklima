import { compare, hash } from 'bcryptjs';
import password from 'secure-random-password';

export async function passwordHash(password: string, saltOrRounds = 10) {
  return await hash(password, saltOrRounds);
}

export async function comparePassword(plaintextPassword: string, hash: string) {
  return await compare(plaintextPassword, hash);
}

export function generatePassword(length = 8) {
  return password.randomPassword({
    length: length,
    characters: [{ characters: password.upper, exactly: 1 }, password.digits, password.lower]
  });
}
