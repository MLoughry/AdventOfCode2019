import { SolutionFile } from './common/SolutionFile';
import log from 'fancy-log'
import { blue, yellow } from 'ansi-colors';
import { watch, readFileSync } from 'fs'
import { resolve } from 'path';

async function main() {
    if (!process.argv[2]) {
        console.error('Must pass a day to run');
        return;
    }

    const day = parseInt(process.argv[2], 10);
    const solverFilePath = resolve(__dirname, `./day${day.toString().padStart(2, '0')}`);

    runSolver(solverFilePath);
    watch(solverFilePath, {recursive: true})
        .on(
            'change',
            () => {
                runSolver(solverFilePath);
            });
}

main();

async function runSolver(solverDirPath: string) {
    try {
        delete require.cache[solverDirPath];
        const solver = require(solverDirPath) as SolutionFile;
        const input = readFileSync(resolve(solverDirPath, 'input.txt')).toString();
        console.time('Solver runtime');
        const { part1, part2 } = await solver.default(input);
        console.timeEnd('Solver runtime');
        if (typeof part1 !== 'undefined') {
            log(yellow(`Part 1: ${blue(part1.toString())}`));
        }
        if (typeof part2 !== 'undefined') {
            log(yellow(`Part 2: ${blue(part2.toString())}`));
        }
        log('');
    }
    catch (err) {
        console.error(err);
    }
}
