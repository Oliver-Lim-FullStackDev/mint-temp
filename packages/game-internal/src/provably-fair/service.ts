import crypto from 'crypto';

export class ProvablyFairService {
  private readonly entropySize = 32;
  private readonly serverSeeds = new Map<string, string>();

  generateServerSeed(): string {
    return crypto.randomBytes(this.entropySize).toString('hex');
  }

  generateClientSeed(): string {
    return crypto.randomBytes(this.entropySize).toString('hex');
  }

  /**
   * Generate a new server seed, store it for the session and
   * return its SHA256 hash so the client can verify later.
   */
  commitServerSeed(userId: string): string {
    const seed = this.generateServerSeed();
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    this.serverSeeds.set(userId, seed);
    return hash;
  }

  /**
   * Retrieve and clear the current server seed for a user. Throws if no
   * commitment has been made yet.
   */
  useCommittedSeed(userId: string): string {
    const seed = this.serverSeeds.get(userId);
    if (!seed) throw new Error('No committed server seed');
    this.serverSeeds.delete(userId);
    return seed;
  }

  combineSeeds(serverSeed: string, clientSeed: string): string {
    return `${serverSeed}:${clientSeed}`;
  }

  createDeterministicRNG(seed: string): () => number {
    const hmacKey = Buffer.from(seed);
    let counter = 0;

    return () => {
      const hmac = crypto.createHmac('sha256', hmacKey);
      hmac.update(Buffer.from(counter.toString()));
      const hash = hmac.digest();
      counter++;

      // Convert the first 4 bytes of hash into a float between 0 and 1
      const intVal = hash.readUInt32BE(0);
      return intVal / 2 ** 32;
    };
  }

  verifySeed(serverSeed: string, clientSeed: string, expected: string): boolean {
    const combined = this.combineSeeds(serverSeed, clientSeed);
    const regenerated = this.createDeterministicRNG(combined)();

    return regenerated.toFixed(6) === parseFloat(expected).toFixed(6);
  }
}
