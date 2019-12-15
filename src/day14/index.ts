import { Solution } from "../common/SolutionFile";

interface ReactionComponent {
  name: string;
  amount: number;
}

interface Reaction {
  result: ReactionComponent;
  inputs: ReactionComponent[];
}

const FUEL = "FUEL";
const ORE = "ORE";
const ONE_TRILLION = 1_000_000_000_000;

export default function solve(input: string): Solution {
  const reactions = parseReactions(input);

  const part1 = getOreRequiredForFuel(reactions);

  let low = Math.floor(ONE_TRILLION / part1),
    high = 1_000_000_000;

  while (true) {
    if (high - low <= 1) {
      break;
    }

    const mid = Math.ceil((low + high) / 2);
    const oreRequiredForTotalFuel = getOreRequiredForFuel(reactions, mid);

    if (oreRequiredForTotalFuel <= ONE_TRILLION) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return {
    part1,
    part2: low
  };
}

function parseReactions(input: string): Map<string, Reaction> {
  const regex = /^(?<inputReactants>\d+ \w+(, \d+ \w+)*) => (?<output>\d+ \w+)$/gm;

  const reactionMap = new Map<string, Reaction>();

  for (const {
    groups: { inputReactants = "", output = "" } = {}
  } of input.matchAll(regex)) {
    const result = parseReactionComponent(output);
    const inputs = inputReactants.split(", ").map(parseReactionComponent);

    reactionMap.set(result.name, { result, inputs });
  }

  return reactionMap;
}

function parseReactionComponent(input: string): ReactionComponent {
  const [amount, name] = input.split(" ");
  return {
    name,
    amount: parseInt(amount)
  };
}

function getOreRequiredForFuel(
  reactions: Map<string, Reaction>,
  fuel: number = 1
): number {
  const intermediateReactants = [...reactions.keys()].filter(
    name => name !== FUEL && name !== ORE
  );

  let totalOre = 0;
  let workingSet: Map<string, number> = new Map(
    reactions.get("FUEL")?.inputs?.map(({ name, amount }) => [name, amount * fuel]) ??
      []
  );

  while (
    intermediateReactants.some(
      name => workingSet.has(name) && workingSet.get(name)! > 0
    )
  ) {
    for (const name of intermediateReactants) {
      if (!workingSet.has(name) || workingSet.get(name)! <= 0) {
        continue;
      }
      const amountNeeded = workingSet.get(name)!;
      const {
        result: { amount: amountPerReaction },
        inputs: reactionInputs
      } = reactions.get(name)!;

      const numberOfReactions = Math.ceil(amountNeeded / amountPerReaction);

      workingSet.set(
        name,
        amountNeeded - numberOfReactions * amountPerReaction
      );

      for (const { name, amount } of reactionInputs) {
        if (name === ORE) {
          totalOre += amount * numberOfReactions;
        } else {
          workingSet.set(
            name,
            (workingSet.get(name) ?? 0) + amount * numberOfReactions
          );
        }
      }
    }
  }

  return totalOre;
}
