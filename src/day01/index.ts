import { Solution } from "../common/SolutionFile";

export default function solve(input: string): Solution {
  const moduleMasses = input
    .split("\n")
    .filter(n => !!n)
    .map(n => parseInt(n));

    const solution: Required<Solution<number>> = {
        part1: 0,
        part2: 0
    };

    for (const mass of moduleMasses) {
        let fuel = Math.floor(mass / 3) - 2;
        solution.part1 += fuel;

        while (fuel > 0) {
            solution.part2 += fuel;
            fuel = Math.floor(fuel / 3) - 2;
        }
    }

    return solution;
}
