import * as crypto from 'crypto';

export function generateNonce(): string {
  return Math.random().toString(36).slice(2);
}

// function : Generate a deterministic ID based on the wallet address
type GenerateUserDataOptions = {
  prefix?: string;
  unique?: boolean;
  maxLength?: number;
};

export function generateUserData(
  id: string | number,
  { prefix = 'u_', unique = false, maxLength = 16 }: GenerateUserDataOptions = {},
) {
  const MAX_USERNAME_LENGTH = maxLength;
  const PREFIX = prefix;
  const remainingLength = MAX_USERNAME_LENGTH - PREFIX.length;

  // Sanitize id and timestamp
  const stringId = String(id);
  const timestamp = Date.now().toString();

  let coreSlug = '';

  if (unique) {
    // Try to use as much of the ID and timestamp as will fit
    const maxIdLength = Math.floor(remainingLength / 2);
    const maxTimeLength = remainingLength - maxIdLength;

    coreSlug = stringId.slice(0, maxIdLength) + timestamp.slice(-maxTimeLength);
  } else {
    // Just use ID truncated to fit
    coreSlug = stringId.slice(0, remainingLength);
  }

  const userSlug = PREFIX + coreSlug;

  if (userSlug.length > MAX_USERNAME_LENGTH) {
    throw new Error(`User slug="${userSlug}" exceeds ${MAX_USERNAME_LENGTH} characters`);
  }

  const userData = {
    username: userSlug,
    email: `${userSlug}@email.com`,
    password: `pas$${userSlug}`,
    passwordConfirmation: `pas$${userSlug}`,
  };

  return userData;
}

/**
 * Hash a nonce using HASH_KEY as the key
 * @param nonce - The nonce to hash
 * @param hashKey - The hash key to use
 * @returns Hashed nonce string
 */
export function hashNonce(nonce: string, hashKey: string): string {
  return crypto.createHmac('sha256', hashKey).update(nonce).digest('hex');
}

export const u32le = n => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0, 0); return b; };
export const u64le = n => {
  const b = Buffer.alloc(8);
  b.writeUInt32LE(n >>> 0, 0);
  b.writeUInt32LE(Math.floor(n / 0x100000000) >>> 0, 4);
  return b;
};
export const u32be = n => { const b = Buffer.alloc(4); b.writeInt32BE(n | 0, 0); return b; }; // signed int32 BE
