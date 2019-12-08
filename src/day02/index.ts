import { Solution } from "../common/SolutionFile";

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
  return runProgram(program);
}

function solvePart2([initialOpCode, initialNoun, initialVerb, ...remainingProgram]: number[]): number {
    const expectedOutput = 19690720;

    for(let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb ++) {
            const result = runProgram([initialOpCode, noun, verb, ...remainingProgram])

            if (result === expectedOutput) {
                return 100 * noun + verb;
            }
        }
    }

    throw new Error('No valid value')
}

function runProgram(program: number[]): number {
  let ip = 0;

  while (program[ip] !== 99) {
    const op1 = program[program[ip + 1]];
    const op2 = program[program[ip + 2]];
    const destAddress = program[ip + 3];

    switch (program[ip]) {
      case 1:
        program[destAddress] = op1 + op2;
        break;
      case 2:
        program[destAddress] = op1 * op2;
        break;
      default:
        throw new Error("Invalid op code");
    }

    ip += 4;
  }

  return program[0];
}
