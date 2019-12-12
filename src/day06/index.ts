import { Solution } from "../common/SolutionFile";

interface Planet {
  name: string;
  orbiting?: Planet;
  orbiters: Set<Planet>;
}

export default function solve(input: string): Solution {
  const system = new PlanetarySystem(input);

  return {
    part1: system.getNumberOfDirectAndIndirectOrbits(),
    part2: system.getNumberOfOrbitalTransfers()
  };
}

class PlanetarySystem {
  private planets: Map<string, Planet> = new Map<string, Planet>();

  constructor(planetGraph: string) {
    const orbits = planetGraph.split("\n");

    for (const orbit of orbits) {
      const [center, orbiter] = orbit.split(")");
      const centerPlanet = this.getPlanet(center);
      const orbiterPlanet = this.getPlanet(orbiter);
      centerPlanet.orbiters.add(orbiterPlanet);
      orbiterPlanet.orbiting = centerPlanet;
    }
  }

  public getPlanet(planetId: string): Planet {
    if (this.planets.has(planetId)) {
      return this.planets.get(planetId)!;
    } else {
      const newPlanet: Planet = {
        name: planetId,
        orbiters: new Set<Planet>()
      };
      this.planets.set(planetId, newPlanet);
      return newPlanet;
    }
  }

  public getNumberOfDirectAndIndirectOrbits() {
    const orbitCache = new Map<Planet, number>();

    function countOrbits(planet: Planet): number {
      let count = planet.orbiters.size;
      for (const orbiter of planet.orbiters) {
        count += orbitCache.get(orbiter) ?? countOrbits(orbiter);
      }
      orbitCache.set(planet, count);
      return count;
    }

    countOrbits(this.planets.get("COM")!);
    return [...orbitCache.values()].reduce((sum, orbits) => sum + orbits, 0);
  }

  public getNumberOfOrbitalTransfers(): number {
    const YOU = this.getPlanet("YOU");
    const SAN = this.getPlanet("SAN");
    const distanceFromYou = new Map<Planet, number>([[YOU.orbiting!, 0]]);
    const workQueue = [YOU.orbiting!];

    console.dir(YOU);

    while (workQueue.length) {
      const current = workQueue.shift()!;
      const currentDistance = distanceFromYou.get(current)!;

      if (current.orbiting === SAN || current.orbiters.has(SAN)) {
        return currentDistance;
      }

      if (current.orbiting) {
        pushNewPlanet(current.orbiting);
      }
      for (const orbiter of current.orbiters) {
        pushNewPlanet(orbiter);
      }

      function pushNewPlanet(planet: Planet) {
        //   console.log(`Looking at ${planet.name}`);
        //   console.dir([...distanceFromYou])
        if (!distanceFromYou.has(planet)) {
          // console.log(`Pushing ${planet.name}`);
          distanceFromYou.set(planet, currentDistance + 1);
          workQueue.push(planet);
        }
      }
    }

    throw new Error(
      `Could not find number of orbital transers after viewing ${distanceFromYou.size} planets`
    );
  }
}
