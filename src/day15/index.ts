import { Solution } from "../common/SolutionFile";
import { runProgram } from "../common/IntcodeComputer";
import { EventEmitter } from "events";
import { CoordinateSet } from "../common/CoordinateSet";

const enum CellValue {
  Empty,
  Wall,
  OxygenSystem
}

const enum Direction {
  North = 1,
  South = 2,
  West = 3,
  East = 4
}

type DroidMap = (CellValue | undefined)[][];

export default function solve(input: string): Solution {
  const program = input.split(",").map(n => parseInt(n));

  const {map, oxygenSystemPosition} = getMapToOxygenSystem(program);



  return {
    part1: findMinDistanceToOxygenSystem(map),
    part2: findTimeToFullySaturate(map, oxygenSystemPosition)
  };
}

function findMinDistanceToOxygenSystem(map: DroidMap) {
    const seenCells = new CoordinateSet();
    const workingQueue: [Readonly<[number, number]>, number][] = [
      [[0, 0] as const, 0]
    ];

    while (workingQueue.length) {
      const [position, distance] = workingQueue.shift()!;

      seenCells.add(...position);

      for (const dir of [
        Direction.North,
        Direction.South,
        Direction.West,
        Direction.East
      ]) {
        const [x, y] = getCellOffset(position, dir);
        if (seenCells.has(x, y)) {
          continue;
        } else if (map[x][y] === CellValue.OxygenSystem) {
          return distance + 1;
        } else if (map[x][y] === CellValue.Empty) {
          workingQueue.push([[x, y], distance + 1]);
        }
      }
    }
}

function findTimeToFullySaturate(map: DroidMap, startPosition: Readonly<[number, number]>) {
    const seenCells = new CoordinateSet();
    const workingQueue: [Readonly<[number, number]>, number][] = [
      [startPosition, 0]
    ];
    let maxDistance = 0;

    while (workingQueue.length) {
      const [position, distance] = workingQueue.shift()!;

      maxDistance = distance;
      seenCells.add(...position);

      for (const dir of [
        Direction.North,
        Direction.South,
        Direction.West,
        Direction.East
      ]) {
        const [x, y] = getCellOffset(position, dir);
        if (seenCells.has(x, y)) {
          continue;
        }  else if (map[x][y] === CellValue.Empty) {
          workingQueue.push([[x, y], distance + 1]);
        }
      }
    }

    return maxDistance;
}

function getMapToOxygenSystem(program: number[]) {
  const maps = [
    walkMapWithRule(program, rotateDirectionRight),
    walkMapWithRule(program, rotateDirectionLeft)
  ];
  const map: DroidMap = [];
  let oxygenSystemPosition: [number, number] = [0,0];
  for (let x = -21; x <= 20; x++) {
    map[x] = [];
    for (let y = -21; y <= 20; y++) {
      map[x][y] = maps[0][x]?.[y] ?? maps[1][x]?.[y];
      if (map[x][y] === CellValue.OxygenSystem) {
          oxygenSystemPosition = [x,y];
      }
    }
  }

  return {map, oxygenSystemPosition};
}

function walkMapWithRule(
  program: number[],
  rotationRule: (dir: Direction) => Direction
) {
  const map: DroidMap = [[CellValue.Empty]];
  let position: [number, number] = [0, 0];
  let steps: Direction[] = [];
  let lastDirection: Direction = Direction.North;
  let lastStepWasBacktrack = false;
  const outputEmitter = new EventEmitter();
  outputEmitter.on("output", onStatus);
  function getNextDirection(): number {
    for (let i = 0; i < 4; i++) {
      lastDirection = rotationRule(lastDirection);
      const [x, y] = getCellOffset(position, lastDirection);
      if (map[x]?.[y] === undefined) {
        lastStepWasBacktrack = false;
        return lastDirection;
      }
    }
    lastDirection = reverseDirection(steps.pop()!);
    lastStepWasBacktrack = true;
    return lastDirection;
  }
  function onStatus(status: number) {
    const [x, y] = getCellOffset(position, lastDirection);
    switch (status) {
      case 0: {
        map[x] = map[x] ?? [];
        map[x][y] = CellValue.Wall;
        break;
      }
      case 1: {
        map[x] = map[x] ?? [];
        map[x][y] = CellValue.Empty;
        position = [x, y];
        if (!lastStepWasBacktrack) {
          steps.push(lastDirection);
        }
        break;
      }
      case 2: {
        map[x] = map[x] ?? [];
        map[x][y] = CellValue.OxygenSystem;
        position = [x, y];
        break;
      }
    }
  }
  runProgram(program, getNextDirection, outputEmitter);
  return map;
}

function getCellOffset(
  position: Readonly<[number, number]>,
  dir: Direction
): [number, number] {
  const [x, y] = position;
  switch (dir) {
    case Direction.North:
      return [x, y - 1];
    case Direction.South:
      return [x, y + 1];
    case Direction.West:
      return [x - 1, y];
    case Direction.East:
      return [x + 1, y];
  }
}

function rotateDirectionRight(dir: Direction): Direction {
  return {
    [Direction.North]: Direction.East,
    [Direction.South]: Direction.West,
    [Direction.West]: Direction.North,
    [Direction.East]: Direction.South
  }[dir];
}

function rotateDirectionLeft(dir: Direction): Direction {
  return {
    [Direction.North]: Direction.West,
    [Direction.South]: Direction.East,
    [Direction.West]: Direction.South,
    [Direction.East]: Direction.North
  }[dir];
}

function reverseDirection(dir: Direction): Direction {
  return {
    [Direction.North]: Direction.South,
    [Direction.South]: Direction.North,
    [Direction.West]: Direction.East,
    [Direction.East]: Direction.West
  }[dir];
}

function serializeMap(
  map: DroidMap,
  position: number[],
  lastDirection: Direction
) {
  let serializedMap = "";
  for (let y = -21; y <= 20; y++) {
    for (let x = -21; x <= 20; x++) {
      if (position[0] === x && position[1] === y) {
        serializedMap +=
          lastDirection === Direction.North
            ? "^"
            : lastDirection === Direction.South
            ? "v"
            : lastDirection === Direction.West
            ? "<"
            : ">";
      } else if (x === 0 && y === 0) {
        serializedMap += "*";
      } else if (map[x]?.[y] === CellValue.Empty) {
        serializedMap += ".";
      } else if (map[x]?.[y] === CellValue.Wall) {
        serializedMap += "#";
      } else if (map[x]?.[y] === CellValue.OxygenSystem) {
        serializedMap += "O";
      } else {
        serializedMap += " ";
      }
    }
    serializedMap += "\n";
  }

  return serializedMap;
}
