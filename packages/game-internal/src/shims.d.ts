declare module 'fs' {
  export function readFileSync(path: string, options?: string | { encoding?: string }): string;
}

declare module 'path' {
  export function resolve(...paths: string[]): string;
}

declare module 'crypto' {
  export function randomBytes(size: number): { toString(encoding: string): string };
  export function createHash(algorithm: string): {
    update(data: string): { digest(encoding: string): string };
  };
  export function createHmac(algorithm: string, key: unknown): {
    update(data: unknown): void;
    digest(): Buffer;
  };
}

declare const __dirname: string;

type Buffer = {
  readUInt32BE(offset: number): number;
};

declare const Buffer: {
  from(data: string | ArrayBuffer | ArrayLike<number>, encoding?: string): Buffer;
};
