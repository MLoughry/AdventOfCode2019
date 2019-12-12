import { Solution } from "../common/SolutionFile";
import { CoordinateSet } from "../common/CoordinateSet";

export default function solve(input: string): Solution {
  const wires = input
    .split("\n")
    .map(wire => wire.split(","))
    .map(parseWireInstructions);

  const part1 = [...wires[0].intersect(wires[1])].reduce(
    (minDistance, intersection) =>
      Math.min(minDistance, Math.abs(intersection[0]) + Math.abs(intersection[1])),
    Number.MAX_SAFE_INTEGER
  );
  return {part1};
}

function parseWireInstructions(wireInstructions: string[]): CoordinateSet {
  const wireCoords = new CoordinateSet();

  let currentPosition: [number, number] = [0, 0];
  const instructionRegex = /^(?<dir>U|D|R|L)(?<distance>\d+)$/;

  for (const instruction of wireInstructions) {
    const { groups } = instructionRegex.exec(instruction)!;
    const distance = parseInt(groups!.distance);
    let newPosition: [number, number];
    let [x, y] = currentPosition;

    switch (groups!.dir) {
      case "U":
        newPosition = [x, y + distance];
        break;
      case "D":
        newPosition = [x, y - distance];
        break;
      case "L":
        newPosition = [x - distance, y];
        break;
      case "R":
        newPosition = [x + distance, y];
        break;
      default:
        throw new Error("Invalid direction");
    }

    wireCoords.addRange(currentPosition, newPosition);
    currentPosition = newPosition;
  }

  wireCoords.delete(0, 0);

  return wireCoords;
}


