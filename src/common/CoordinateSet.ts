export class CoordinateSet {
  private coords: Map<number, Set<number>> = new Map<number, Set<number>>();

  add(x: number, y: number) {
    const row = this.coords.get(x) ?? new Set<number>();
    row.add(y);
    this.coords.set(x, row);
  }

  has(x: number, y: number): boolean {
        return this.coords.has(x) && this.coords.get(x)!.has(y);
  }

  addRange([ax, ay]: [number, number], [bx, by]: [number, number]) {
    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++) {
      for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++) {
        this.add(x, y);
      }
    }
  }

  delete(x: number, y: number) {
    this.coords.get(x)?.delete?.(y);
  }

  get size(): number {
    return [...this.coords.values()].reduce((sum, set) => sum + set.size, 0);
  }

  *intersect(other: CoordinateSet): IterableIterator<[number, number]> {
    for (const [x, row] of this.coords) {
      if (other.coords.has(x)) {
        for (const y of row) {
          if (other.coords.get(x)?.has(y)) {
            yield [x, y];
          }
        }
      }
    }
    return;
  }

  *[Symbol.iterator](): IterableIterator<[number, number]> {
    for (const [x, row] of this.coords) {
      for (const y of row) {
        yield [x, y];
      }
    }
    return;
  }
}
