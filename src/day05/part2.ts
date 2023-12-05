import { parseInput } from "../util";

function isNotNull<T>(value: T | undefined | null): value is T {
  return value !== null;
}

class Range {
  constructor(
    public readonly start: number,
    public readonly length: number
  ) {}

  public get end(): number {
    return this.start + this.length - 1;
  }
}

class Block {
  public readonly data: {
    destinationRangeStart: number;
    range: Range;
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
        range: new Range(Number(sourceRangeStart), Number(rangeLength)),
      };
    });
    this.data = data;
  }

  public *getDestination(
    seeds: Generator<Range>,
    debug = false
  ): Generator<Range> {
    for (const seed of seeds) {
      for (const d of this.data) {
        // if seed is after the end of the range, yield it
        if (seed.start > d.range.end) {
          yield seed;
          continue;
        }

        // if seed is before the start of the range, yield it
        if (seed.end < d.range.start) {
          yield seed;
          continue;
        }

        // if seed is fully contained in the range
        if (seed.start >= d.range.start && seed.end <= d.range.end) {
          const offset = d.destinationRangeStart - d.range.start;
          const range = new Range(seed.start + offset, seed.length);

          yield range;
          continue;
        }

        const doesSeedStartBeforeRange = seed.start < d.range.start;
        const doesSeedEndAfterRange = seed.end > d.range.end;

        let start = seed.start;
        if (doesSeedStartBeforeRange) {
          const startOfIntersection = d.range.start - seed.start;
          start = d.range.start;
          const before = new Range(seed.start, startOfIntersection);

          yield before;
        }

        let end = seed.end;
        if (doesSeedEndAfterRange) {
          const endOfIntersection = seed.end - d.range.end;
          end = d.range.end;
          const after = new Range(d.range.end + 1, endOfIntersection);

          yield after;
        }

        const offset = d.destinationRangeStart - d.range.start;
        const intersection = new Range(start + offset, end - start + 1);

        yield intersection;
      }
    }

    return [];
  }
}

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

const blocks = new Map<string, Block>();

for (let i = 1; i < input.length; i++) {
  const line = input[i];
  if (line === "") {
    continue;
  }
  const [block, next] = parseBlock(i, input);
  i = next;
  blocks.set(block.name, block);
}

function* parseSeeds(input: string): Generator<Range> {
  const [_, values] = input.split(":");
  const numbers = values
    .split(" ")
    .filter((a) => !!a.trim())
    .map(Number);

  for (let i = 0; i < numbers.length; i += 2) {
    yield new Range(numbers[i], numbers[i + 1]);
  }
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

function* doWork() {
  const seeds = parseSeeds(input[0]);

  const soilBlock = blocks.get("seed-to-soil map:");
  const soil = soilBlock?.getDestination(seeds);

  if (!soil) {
    return;
  }

  const fertilizerBlock = blocks.get("soil-to-fertilizer map:");
  const fertilizer = fertilizerBlock?.getDestination(soil);

  if (!fertilizer) {
    return;
  }

  const waterBlock = blocks.get("fertilizer-to-water map:");
  const water = waterBlock?.getDestination(fertilizer);

  if (!water) {
    return;
  }

  const lightBlock = blocks.get("water-to-light map:");
  const light = lightBlock?.getDestination(water);

  if (!light) {
    return;
  }

  const temperatureBlock = blocks.get("light-to-temperature map:");
  const temperature = temperatureBlock?.getDestination(light);

  if (!temperature) {
    return;
  }

  const humidityBlock = blocks.get("temperature-to-humidity map:");
  const humidity = humidityBlock?.getDestination(temperature, true);

  if (!humidity) {
    return;
  }

  // const locationBlock = blocks.get("humidity-to-location map:");
  // const locations = locationBlock?.getDestination(humidity);

  // if (!locations) {
  //   return;
  // }

  yield* humidity;
}

const result = Array.from(doWork());

for (const r of result) {
  console.log(r);
}

console.log(result);
