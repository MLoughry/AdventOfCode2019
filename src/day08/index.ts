import { Solution } from "../common/SolutionFile";

const ROW_SIZE = 25;
const COL_SIZE = 6;

export default function solve(input: string): Solution {
  const digits = input
    .split("")
    .map(n => parseInt(n))
    .filter(n => !isNaN(n));

  const layers: number[][][] = [];

  while (digits.length) {
    const newLayer: number[][] = [];
    for (let x = 0; x < COL_SIZE; x++) {
      newLayer.push(digits.splice(0, ROW_SIZE));
    }
    layers.push(newLayer);
  }

  const part1 = solvePart1(layers);
  const part2 = solvePart2(layers);
  return { part1, part2 };
}

function solvePart1(layers: number[][][]) {
  let layerWithFewestZeros: number[][] = layers[0];
  let fewestZeroes = countDigits(layers[0], 0);

  for (const layer of layers.slice(1)) {
    const currentSum = countDigits(layer, 0);

    if (currentSum < fewestZeroes) {
      layerWithFewestZeros = layer;
      fewestZeroes = currentSum;
    }
  }

  return (
    countDigits(layerWithFewestZeros, 1) * countDigits(layerWithFewestZeros, 2)
  );
}

function solvePart2(layers: number[][][]) {
  const buffer = zBufferLayers(layers);

  return (
    "\n" +
    buffer.map(row => row.map(n => (n === 0 ? "█" : " ")).join("")).join("\n")
  );
}

function zBufferLayers(layers: number[][][]) {
  const finalResult: number[][] = [];

  for (let x = 0; x < COL_SIZE; x++) {
    finalResult[x] = [];
    for (let y = 0; y < ROW_SIZE; y++) {
      for (const layer of layers) {
        if (layer[x][y] !== 2) {
          finalResult[x][y] = layer[x][y];
          break;
        }
      }
    }
  }

  return finalResult;
}

function countDigits(layer: number[][], digit: number) {
  return layer
    .map(row => row.reduce((sum, cell) => (cell === digit ? sum + 1 : sum), 0))
    .reduce((sum, rowCount) => sum + rowCount, 0);
}
