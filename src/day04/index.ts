import { Solution } from "../common/SolutionFile";

export default function solve(input: string): Solution {
  const [start, end] = input.split("-").map(n => parseInt(n));

  let part1 = 0;
  let part2 = 0;

  for (let i = start; i <= end; i++) {
    if (isValidPasswordPart1(i)) {
      part1++;
    }
    if (isValidPasswordPart2(i)) {
      part2++;
    }
  }

  return { part1, part2 };
}

function isValidPasswordPart1(n: number): boolean {
  const str = n.toString();
  return (
    /(\d)\1/.test(str) &&
    str[0] <= str[1] &&
    str[1] <= str[2] &&
    str[2] <= str[3] &&
    str[3] <= str[4] &&
    str[4] <= str[5]
  );
}

function isValidPasswordPart2(n: number): boolean {
  const str = n.toString();
  return (
    isValidPasswordPart1(n) &&
    /(^|[123456789])00($|[123456789])|(^|[023456789])11($|[023456789])|(^|[013456789])22($|[013456789])|(^|[012456789])33($|[012456789])|(^|[012356789])44($|[012356789])|(^|[012346789])55($|[012346789])|(^|[012345789])66($|[012345789])|(^|[012345689])77($|[012345689])|(^|[012345679])88($|[012345679])|(^|[012345678])99($|[012345678])/.test(
      str
    )
  );
}
