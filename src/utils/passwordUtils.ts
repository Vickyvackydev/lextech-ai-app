import { randomBytes, pbkdf2Sync } from 'crypto';

export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = randomBytes(16).toString('hex');

  // Hash the password using PBKDF2
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Return the salt and hash combined
  return `${salt}:${hash}`;
}

export function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  const [salt, originalHash] = storedPassword.split(':');

  // Hash the supplied password using the same salt
  const hash = pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex');

  // Compare the hashes
  return hash === originalHash;
}