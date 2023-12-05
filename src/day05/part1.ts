import { parseInput } from "../util";

class Block {
  public readonly data: {
    destinationRangeStart: number;
    sourceRangeStart: number;
    rangeLength: number;
  }[];

  constructor(
    public index: number,
    public name: string,
    public lines: string[]
  ) {
    const data = lines.map((line) => {
      const [destinationRangeStart, sourceRangeStart, rangeLength] =
        line.split(" ");
      return {
        destinationRangeStart: Number(destinationRangeStart),
        sourceRangeStart: Number(sourceRangeStart),
        rangeLength: Number(rangeLength),
      };
    });
    this.data = data;
  }

  public isInSource(seed?: number): number {
    if (!seed) {
      return -1;
    }
    return this.data.findIndex((line) => {
      return (
        seed >= line.sourceRangeStart &&
        seed <= line.sourceRangeStart + line.rangeLength
      );
    });
  }

  public getDestination(seed?: number) {
    if (!seed) {
      return undefined;
    }
    const index = this.isInSource(seed);
    if (index !== -1) {
      const delta = seed - this.data[index].sourceRangeStart;
      const destination = this.data[index].destinationRangeStart + delta;
      return destination;
    } else {
      return seed;
    }
  }
}

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

const blocks = new Map<string, Block>();
const seeds = parseSeeds(input[0]);
for (let i = 1; i < input.length; i++) {
  const line = input[i];
  if (line === "") {
    continue;
  }
  const [block, next] = parseBlock(i, input);
  i = next;
  blocks.set(block.name, block);
}

function parseSeeds(input: string): number[] {
  const [_, values] = input.split(":");
  return values
    .split(" ")
    .filter((a) => !!a.trim())
    .map(Number);
}

function parseBlock(index: number, input: string[]): [Block, number] {
  const lines: string[] = [];

  const name = input[index];
  let skip = index;

  for (let i = index + 1; i < input.length; i++) {
    const line = input[i];
    if (line === "") {
      skip++;
      break;
    }
    lines.push(line);
    skip++;
  }

  return [new Block(index, name, lines), skip];
}

// TODO: Complete Part 1

const locations = seeds
  .map((seed) => {
    const soilBlock = blocks.get("seed-to-soil map:");
    const soil = soilBlock?.getDestination(seed);
    const fertilizerBlock = blocks.get("soil-to-fertilizer map:");
    const fertilizer = fertilizerBlock?.getDestination(soil);
    const waterBlock = blocks.get("fertilizer-to-water map:");
    const water = waterBlock?.getDestination(fertilizer);
    const lightBlock = blocks.get("water-to-light map:");
    const light = lightBlock?.getDestination(water);
    const temperatureBlock = blocks.get("light-to-temperature map:");
    const temperature = temperatureBlock?.getDestination(light);
    const humidityBlock = blocks.get("temperature-to-humidity map:");
    const humidity = humidityBlock?.getDestination(temperature);
    const locationBlock = blocks.get("humidity-to-location map:");
    const location = locationBlock?.getDestination(humidity);
    return location;
  })
  .filter((a) => !!a);

let minLocation = Number.MAX_SAFE_INTEGER;
for (const location of locations) {
  minLocation = Math.min(minLocation, location ?? Number.MAX_SAFE_INTEGER);
}
