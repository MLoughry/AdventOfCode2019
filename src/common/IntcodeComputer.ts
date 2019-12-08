export interface ProgramResult {
  memory: number[];
  outputs?: number[];
}

export function runProgram(
  program: number[],
  inputs?: number[]
): ProgramResult {
  const memory = [...program];
  let ip = 0;
  const outputs: number[] = [];

  while (memory[ip] !== 99) {
    const opCode = memory[ip] % 100;
    switch (opCode) {
      case 1: {
        // ADD
        const destAddress = memory[ip + 3];
        memory[destAddress] = getParameter(1) + getParameter(2);
        ip += 4;
        break;
      }
      case 2: {
        // MULT
        const destAddress = memory[ip + 3];
        memory[destAddress] = getParameter(1) * getParameter(2);
        ip += 4;
        break;
      }
      case 3: {
        // INPUT
        const destAddress = memory[ip + 1];
        memory[destAddress] = inputs?.shift()!;
        ip += 2;
        break;
      }
      case 4: {
        // INPUT
        outputs.push(getParameter(1));
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
        memory[memory[ip + 3]] = getParameter(1) < getParameter(2) ? 1 : 0;
        ip += 4;
        break;
      }
      case 8: {
        // equals
        memory[memory[ip + 3]] = getParameter(1) === getParameter(2) ? 1 : 0;
        ip += 4;
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
    const isImmediateMode =
      Math.floor(opCode / Math.pow(10, parameterIndex + 1)) % 10 === 1;

    if (isImmediateMode) {
      return memory[ip + parameterIndex];
    } else {
      return memory[memory[ip + parameterIndex]];
    }
  }
}
