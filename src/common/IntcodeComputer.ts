import { EventEmitter } from "events";

export interface ProgramResult {
  memory: number[];
  outputs?: number[];
}

export function runProgram(
  program: number[],
  inputs?: number[] | (() => number),
  onOutput?: EventEmitter
): ProgramResult {
  const memory = [...program];
  let ip = 0;
  let relativeBase = 0;
  const outputs: number[] = [];

  while (memory[ip] !== 99) {
    const opCode = memory[ip] % 100;
    switch (opCode) {
      case 1: {
        // ADD
        memory[getDestParameter(3)] = getParameter(1) + getParameter(2);
        ip += 4;
        break;
      }
      case 2: {
        // MULT
        memory[getDestParameter(3)] = getParameter(1) * getParameter(2);
        ip += 4;
        break;
      }
      case 3: {
        // INPUT
        memory[getDestParameter(1)] = getInput();
        ip += 2;
        break;
      }
      case 4: {
        // OUTPUT
        output(getParameter(1));
        ip += 2;
        break;
      }
      case 5: {
        // jump-if-true
        if (getParameter(1) !== 0) {
          ip = getParameter(2);
        } else {
          ip += 3;
        }
        break;
      }
      case 6: {
        // jump-if-false
        if (getParameter(1) === 0) {
          ip = getParameter(2);
        } else {
          ip += 3;
        }
        break;
      }
      case 7: {
        // less-than
        memory[getDestParameter(3)] = getParameter(1) < getParameter(2) ? 1 : 0;
        ip += 4;
        break;
      }
      case 8: {
        // equals
        memory[getDestParameter(3)] = getParameter(1) === getParameter(2) ? 1 : 0;
        ip += 4;
        break;
      }
      case 9: {
        // adjust relative base
        relativeBase += getParameter(1);
        ip += 2;
        break;
      }
      default:
        throw new Error(`Invalid op code. IP: ${ip}, op code: ${opCode}`);
    }
  }

  return {
    memory,
    outputs
  };

  function getParameter(
    parameterIndex: number // 1-based index
  ): number {
    const opCode = memory[ip];
    let parameterMode =
      Math.floor(opCode / Math.pow(10, parameterIndex + 1)) % 10;

    let parameterValue: number | undefined;
    switch (parameterMode) {
      case 0:
        parameterValue = memory[(memory[ip + parameterIndex] ?? 0)];
        break;
      case 1:
        parameterValue = memory[ip + parameterIndex];
        break;
      case 2:
        parameterValue = memory[relativeBase + (memory[ip + parameterIndex] ?? 0)];
        break;
      default:
        throw new Error(
          `Invalid parameter mode - opCode: ${opCode}, parameterIndex: ${parameterIndex}, parameterMode: ${parameterMode}`
        );
    }

    return parameterValue ?? 0;
  }

  function getDestParameter(
    parameterIndex: number // 1-based index
  ): number {
    const opCode = memory[ip];
    let parameterMode =
      Math.floor(opCode / Math.pow(10, parameterIndex + 1)) % 10;

    switch (parameterMode) {
      case 0:
        return (memory[ip + parameterIndex] ?? 0);
        break;
      case 2:
        return relativeBase + (memory[ip + parameterIndex] ?? 0);
        break;
      default:
        throw new Error(
          `Invalid parameter mode for dest parameter - opCode: ${opCode}, parameterIndex: ${parameterIndex}, parameterMode: ${parameterMode}`
        );
    }
  }

  function getInput(): number {
    if (typeof inputs === "function") {
      return inputs();
    } else {
      return inputs?.shift()!;
    }
  }

  function output(out: number): void {
    outputs.push(out);
    onOutput?.emit?.("output", out);
  }
}
