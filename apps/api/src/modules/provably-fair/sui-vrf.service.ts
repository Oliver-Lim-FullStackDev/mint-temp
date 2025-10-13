import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

/**
 * Simplified Sui VRF service.
 * Generates a random seed with an accompanying proof and allows verification.
 */
@Injectable()
export class SuiVrfService {
  private readonly entropySize = 32;

  generateSeed(): { seed: string; proof: string } {
    const seedBuf = crypto.randomBytes(this.entropySize);
    const seed = seedBuf.toString('hex');
    const proof = crypto.createHash('sha256').update(seedBuf).digest('hex');
    return { seed, proof };
  }

  verifySeed(seed: string, proof: string): boolean {
    const computed = crypto
      .createHash('sha256')
      .update(Buffer.from(seed, 'hex'))
      .digest('hex');
    return computed === proof;
  }
}