import * as crypto from 'crypto';
import { ProvablyFairService } from './pf.service';

describe('ProvablyFairService', () => {
  it('commits and reveals server seed', () => {
    const service = new ProvablyFairService();
    const user = 'user1';
    const hash = service.commitServerSeed(user);
    const seed = service.useCommittedSeed(user);
    const calculated = crypto.createHash('sha256').update(seed).digest('hex');
    expect(calculated).toBe(hash);
  });

  it('replaces and clears server seed per user', () => {
    const service = new ProvablyFairService();
    const user = 'user1';
    const firstHash = service.commitServerSeed(user);
    const firstSeed = service.useCommittedSeed(user);
    const calculated = crypto.createHash('sha256').update(firstSeed).digest('hex');
    expect(calculated).toBe(firstHash);

    const secondHash = service.commitServerSeed(user);
    const secondSeed = service.useCommittedSeed(user);
    expect(firstSeed).not.toBe(secondSeed);
    expect(firstHash).not.toBe(secondHash);

    expect(() => service.useCommittedSeed(user)).toThrow();
  });
});