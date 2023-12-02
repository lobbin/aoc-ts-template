import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

const result = input
  .map((line) => {
    const games = parseLines(line);
    return games;
  })
  .filter((game) => {
    const RED_MAX = 12;
    const GREEN_MAX = 13;
    const BLUE_MAX = 14;

    if (exceedsMax(game.cubes, "red", RED_MAX)) {
      return false;
    }
    if (exceedsMax(game.cubes, "green", GREEN_MAX)) {
      return false;
    }
    if (exceedsMax(game.cubes, "blue", BLUE_MAX)) {
      return false;
    }
    return true;
  })
  .reduce((acc, game) => {
    return acc + parseInt(game.gameId);
  }, 0);

console.log(result);

// TODO: Complete Part 1

function parseLines(line: string) {
  const [game, data] = line.split(":");
  const gameId = game.trim().replace("Game ", "");
  const runs = data.split(";");
  const cubes = runs
    .flatMap((run) => run.split(","))
    .map((cube) => {
      const item = cube.trim();
      const [value, name] = item.split(" ");
      return { value: parseInt(value.trim()), name: name.trim() };
    });

  const maxCubes = cubes.reduce((acc, cube) => {
    const current = acc.get(cube.name);
    if (current === undefined) {
      acc.set(cube.name, cube.value);
    } else {
      acc.set(cube.name, Math.max(current, cube.value));
    }
    return acc;
  }, new Map<string, number>());

  return { gameId, cubes: maxCubes };
}

function exceedsMax(
  cubes: Map<string, number>,
  color: string,
  max: number
): boolean {
  const value = cubes.get(color);
  if (value === undefined) {
    return false;
  }
  return value > max;
}
