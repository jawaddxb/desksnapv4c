
export class PRNG {
  private seed: number;
  constructor(seedString: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seedString.length; i++) {
      h ^= seedString.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    this.seed = h >>> 0;
  }
  next(): number {
    this.seed = (Math.imul(1664525, this.seed) + 1013904223) | 0;
    return ((this.seed >>> 0) / 4294967296);
  }
  range(min: number, max: number): number { return min + this.next() * (max - min); }
  pick<T>(array: T[]): T { return array[Math.floor(this.next() * array.length)]; }
}
