// Seeded Pseudo-Random Number Generator (Mulberry32)

export class SeededRNG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
  }

  // Returns next random float in [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Next integer in [min, max] inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  pick<T>(array: readonly T[]): T {
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }

  // Shuffle array copy
  shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  getSeed(): number {
    return this.state;
  }
}
