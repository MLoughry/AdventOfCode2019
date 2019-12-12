import { Solution } from "../common/SolutionFile";
import { runProgram } from "../common/IntcodeComputer";

export default function solve(input: string): Solution {
  const program = input.split(",").map(n => parseInt(n));

  return {
    part1: runProgram(program, [1]).outputs![0],
    part2: runProgram(program, [2]).outputs![0]
  };
}