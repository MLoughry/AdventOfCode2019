import { Solution } from "../common/SolutionFile";
import { runProgram } from "../common/IntcodeComputer";

export default function solve(input: string): Solution {
  const program = input.split(",").map(n => parseInt(n));

  // Restore 1202 program alarm
  const part1 = solvePart1([...program]);
  const part2 = solvePart2(program);

  return { part1, part2 };
}

function solvePart1(program: number[]) {
  program[1] = 12;
  program[2] = 2;
  return runProgram(program).memory[0];
}

function solvePart2([initialOpCode, initialNoun, initialVerb, ...remainingProgram]: number[]): number {
    const expectedOutput = 19690720;

    for(let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb ++) {
            const result = runProgram([initialOpCode, noun, verb, ...remainingProgram]).memory[0]

            if (result === expectedOutput) {
                return 100 * noun + verb;
            }
        }
    }

    throw new Error('No valid value')
}
