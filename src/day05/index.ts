import { Solution } from "../common/SolutionFile";
import { runProgram } from "../common/IntcodeComputer";

export default function solve(input: string): Solution{
    const program = input.split(",").map(n => parseInt(n));

    const part1 = runProgram(program, [1])?.outputs?.pop();
    const part2 = runProgram(program, [5])?.outputs?.pop();

    return {part1, part2};
}