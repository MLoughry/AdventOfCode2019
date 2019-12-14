import { Solution } from "../common/SolutionFile";
import { EventEmitter } from "events";
import { runProgram } from "../common/IntcodeComputer";
import { CoordinateSet } from "../common/CoordinateSet";

export default function solve(input: string): Solution {
  const program = input.split(",").map(n => parseInt(n));

  let part1 = solvePart1(program);

  return { part1, part2: solvePart2(program) };
}

function solvePart1(program: number[]) {
  const intcodeOutput = new EventEmitter();
  const grid: number[][] = [];
  function handleDraw(x: number) {
    grid[x] = grid[x] ?? [];
    intcodeOutput.once("output", y => {
      intcodeOutput.once("output", id => {
        grid[x][y] = id;
        intcodeOutput.once("output", handleDraw);
      });
    });
  }
  intcodeOutput.once("output", handleDraw);
  runProgram(program, [], intcodeOutput);
  let part1 = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === 2) {
        part1++;
      }
    }
  }
  return part1;
}

function solvePart2(program: number[]) {
  const intcodeOutput = new EventEmitter();
  let ballPosition: number = 0;
  let paddlePosition: number = 0;
  let score = 0;

  function handleDraw(x: number) {
    intcodeOutput.once("output", y => {
      intcodeOutput.once("output", id => {
        if (x === -1 && y === 0) {
          score = id;
        } else if (id === 3) {
          paddlePosition = x;
        } else if (id === 4) {
          ballPosition = x;
        }
        intcodeOutput.once("output", handleDraw);
      });
    });
  }

  intcodeOutput.once("output", handleDraw);
  program[0] = 2;
  runProgram(
    program,
    () => ballPosition > paddlePosition
        ? 1
        : ballPosition < paddlePosition
        ? -1
        : 0,
    intcodeOutput
  );

  return score;
}
