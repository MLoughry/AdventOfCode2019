export interface Solution<T extends string | number = string | number> {
    part1?: T;
    part2?: T;
}

export type Solver = (input: string) => Promise<Solution>;

export interface SolutionFile {
    default: Solver;
}