import { Solution } from "../common/SolutionFile";
import lcm from 'lcm';

export default function solve(input: string): Solution {
  const system = new System(input);

  for (let i = 0; i < 1000; i++) {
    system.step();
  }
  return {
      part1: system.energy,
      part2: system.findPeriod()
  };
}

type Vector = [number, number, number];

class Body {
  private _position: Vector;
  private _velocity: Vector = [0, 0, 0];

  constructor(entry: string) {
    const { x, y, z } = /<x=(?<x>-?\d+), y=(?<y>-?\d+), z=(?<z>-?\d+)>/.exec(
      entry
    )!.groups!;

    this._position = [parseInt(x), parseInt(y), parseInt(z)];
  }

  stepVelocity(system: System) {
    for (const body of system.bodies) {
      if (this === body) {
        continue;
      }

      body._position.forEach(
        (otherPosition, index) =>
          (this._velocity[index] +=
            otherPosition > this._position[index]
              ? 1
              : otherPosition < this._position[index]
              ? -1
              : 0)
      );
    }
  }

  stepPosition() {
    for (let i = 0; i < 3; i++) {
      this._position[i] += this._velocity[i];
    }
  }

  get position(): Readonly<Vector> {
      return this._position;
  }

  get velocity(): Readonly<Vector> {
      return this._velocity;
  }

  get energy(): number {
    return (
      this._position.reduce((sum, p) => sum + Math.abs(p), 0) *
      this._velocity.reduce((sum, p) => sum + Math.abs(p), 0)
    );
  }
}

class System {
  private _bodies: Body[];

  constructor(input: string) {
    this._bodies = input.split("\n").map(line => new Body(line));
  }

  get bodies(): Readonly<Body[]> {
    return this._bodies;
  }

  get energy(): number {
    return this._bodies.reduce((sum, { energy }) => sum + energy, 0);
  }

  step(): void {
    this.bodies.forEach(b => b.stepVelocity(this));
    this.bodies.forEach(b => b.stepPosition());
  }

  findPeriod(): number {
    const axisPeriods: [number, number, number] = [0,0,0]
    const startStates = [0,1,2].map(axis => this.getAxisState(axis));
    let count = 0;

    while (axisPeriods.some(p => !p)) {
        this.step();
        count++;
        [0,1,2].forEach(axis => {
            if (!axisPeriods[axis] && this.areStatesEqual(startStates[axis], this.getAxisState(axis))) {
                axisPeriods[axis] = count;
            }
        })
    }

    const [x,y,z] = axisPeriods;

    return lcm(x, lcm(y, z));
  }

  private getAxisState(axis: number): number[] {
    return this.bodies.flatMap(({position, velocity}) => [position[axis], velocity[axis]]);
  }

  private areStatesEqual(a: number[], b: number[]) {
      return a.reduce((result, aItem, i) => result && aItem === b[i], true);
  }
}
