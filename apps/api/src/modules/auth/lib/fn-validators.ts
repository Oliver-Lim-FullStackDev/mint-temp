import { createHash, createHmac } from 'crypto';
import { Request } from 'express';
import { sign } from 'tweetnacl';
import { TelegramUser } from '../auth.types';
import { u32be, u32le, u64le } from './fn-generators';

/**
 * Verify Telegram authentication data
 * Based on the Telegram WebApp documentation
 * @param data - The data to verify
 * @returns boolean indicating if the data is valid
 */
export function isValidTelegramHash(telegramInitData: string, telegramBotToken: string): TelegramUser | null {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get('hash');
  const user = initData.get('user') || '{}';
  const dataToCheck = [] as any[];

  initData.sort();
  initData.forEach((val: string, key: string) => key !== 'hash' && dataToCheck.push(`${key}=${val}`));

  const secret = createHmac('sha256', 'WebAppData').update(telegramBotToken).digest();

  const _hash = createHmac('sha256', secret).update(dataToCheck.join('\n')).digest('hex');

  return hash === _hash ? (JSON.parse(user) as TelegramUser) : null;
}

/**
 * Checks if the given timestamp has exceeded the allowed duration compared to the current time.
 *
 * @param timestamp - The Unix timestamp in seconds (e.g. 1720000000)
 * @param durationInSeconds - Duration threshold in seconds (e.g. 86400 for 1 day)
 * @returns true if the duration has elapsed, false otherwise
 */
export function isDurationElapsed(timestamp: number, durationInMilliSeconds: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000); // current time in milliseconds
  return currentTime - timestamp > durationInMilliSeconds;
}

/**
 * Extract IP address from request with fallback logic
 * @param request - Express request object
 * @returns IP address string
 */
export function extractIpAddress(request: Request): string {
  return (
    process.env.CADDY_STATIC_IP ||
    request.ip ||
    (request.headers['x-forwarded-for'] as string) ||
    (request.headers['x-real-ip'] as string) ||
    request.connection?.remoteAddress ||
    '0.0.0.0'
  );
}

/**
 * Extract and validate client type from user agent
 * @param request - Express request object
 * @returns Validated client type string
 */
export function extractClientType(request: Request): string {
  const userAgent = request.headers['user-agent'] || '';
  const userAgentLower = userAgent.toLowerCase();

  let clientType: string;
  if (userAgentLower.includes('iphone') || userAgentLower.includes('ipad')) {
    clientType = 'ios';
  } else if (userAgentLower.includes('android')) {
    clientType = 'android';
  } else if (userAgentLower.includes('mobile')) {
    clientType = 'mobile-browser';
  } else if (userAgentLower.includes('flash')) {
    clientType = 'flash';
  } else {
    clientType = 'browser';
  }

  // Validate client type against allowed values
  const allowedClientTypes = ['browser', 'mobile-browser', 'ios', 'android', 'flash', 'html'];
  return allowedClientTypes.includes(clientType) ? clientType : 'browser';
}


export const validateTonSignature = ({ account, proof }) => {
  // / ---- Build canonical message (per spec) ----
const [workchainStr, addrHex] = account.address.split(':');
const workchain = parseInt(workchainStr, 10);         // 0
const addrHash = Buffer.from(addrHex, 'hex');         // 32 bytes

const prefix = Buffer.from("ton-proof-item-v2/", "utf8");
// BE for workchain:
const workchainBE = u32be(workchain);
// LE for domain length:
const domainLenLE = u32le(proof.domain.lengthBytes);
const domainBytes = Buffer.from(proof.domain.value, 'utf8');
// LE for timestamp:
const tsLE = u64le(proof.timestamp);
const payloadBytes = Buffer.from(proof.payload, 'utf8');

// Concatenate message:
const message = Buffer.concat([
  prefix,
  workchainBE,
  addrHash,
  domainLenLE,
  domainBytes,
  tsLE,
  payloadBytes
]);

// ---- Hash as wallets do: sha256(message), then wrap with 0xffff + "ton-connect" and hash again ----
const innerHash = createHash('sha256').update(message).digest();           // 32 bytes
const domainSep = Buffer.concat([
  Buffer.from([0xff, 0xff]),                          // 0xffff
  Buffer.from("ton-connect", "utf8")
]);
const finalPreimage = Buffer.concat([domainSep, innerHash]);                      // 2 + 12 + 32 = 46 bytes
const finalHash = createHash('sha256').update(finalPreimage).digest();     // 32 bytes

// ---- Decode inputs and verify ----
const sig = Buffer.from(proof.signature, 'base64');           // 64 bytes
const pub = Buffer.from(account.publicKey, 'hex');            // 32 bytes

// IMPORTANT: verify against finalHash, not the raw message
const ok = sign.detached.verify(
  finalHash,    // Uint8Array(32)
  new Uint8Array(sig),
  new Uint8Array(pub)
);

return { ok }
}
