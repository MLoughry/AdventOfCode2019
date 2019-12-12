import { Solution } from "../common/SolutionFile";
import { EventEmitter } from "events";
import { runProgram } from "../common/IntcodeComputer";
import { CoordinateSet } from "../common/CoordinateSet";

const BLACK = 0;
const WHITE = 1;
const LEFT_TURN = 0;
const RIGHT_TURN = 1;

export default function solve(input: string): Solution {
  const program = input.split(",").map(n => parseInt(n));

  return {
    // part1: painterBot(program, 0).panelsPainted,
    part2: painterBot(program, 1).image
  };
}

function painterBot(program: number[], startPanelColor: 0 | 1) {
  let direction: [number, number] = [0, 1];
  let position: [number, number] = [0, 0];
  const canvas: Canvas = new Canvas(startPanelColor);
  const outputEmitter = new EventEmitter();

  function onPaintOutput(color: number) {
    canvas.paint(position, color);
    outputEmitter.once("output", onTurnOutput);
  }

  function onTurnOutput(turnDirection: number) {
    const [dx, dy] = direction;
    if (turnDirection === LEFT_TURN) {
      direction = [dy, -dx];
    } else if (turnDirection === RIGHT_TURN) {
      direction = [-dy, dx];
    }

    const [newDx, newDy] = direction;
    const [x, y] = position;
    position = [x + newDx, y + newDy];
    outputEmitter.once("output", onPaintOutput);
  }

  function onInput(): number {
    return canvas.getColor(position);
  }

  outputEmitter.once("output", onPaintOutput);
  runProgram(program, onInput, outputEmitter);

  return {
    panelsPainted: canvas.panelsPainted,
    image: canvas.image
  };
}

class Canvas {
  private canvas: number[][];
  private minX: number = 0;
  private minY: number = 0;
  private maxX: number = 0;
  private maxY: number = 0;

  // Part one tracking
  private paintedPanels = new CoordinateSet();

  constructor(startPanelColor: 0 | 1) {
    this.canvas = [[startPanelColor]];
  }

  paint([x, y]: [number, number], color: number) {
    this.canvas[x] = this.canvas[x] ?? [];
    this.canvas[x][y] = color;

    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);

    // Part one tracking
    this.paintedPanels.add(x, y);
  }

  getColor([x, y]: [number, number]): number {
    return this.canvas[x]?.[y] ?? BLACK;
  }

  get panelsPainted() {
    return this.paintedPanels.size;
  }

  get image(): string {
    const width = this.maxX - this.minX;
    const height = this.maxY - this.minY;
    // console.log(`Generating ${width}x${height} image...`);
    let buffer = "";
    for (let y = this.maxY; y >= this.minY; y--) {
      buffer += "\n";
      //   console.log(`Row ${x}`);
      for (let x = this.maxX; x >= this.minX; x--) {
        // console.log(`Cell [${x}, ${y}] = ${this.canvas[x]?.[y]}`)
        buffer += this.canvas[x]?.[y] ? "█" : " ";
      }
    }

    return buffer;
  }
}
