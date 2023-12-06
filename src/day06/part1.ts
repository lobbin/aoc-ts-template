import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

// TODO: Complete Part 1

interface Input<T extends "Time" | "Distance"> {
  label: T;
  races: number[];
}

const inputs = input.map((line) => {
  const [label, values] = line.split(":");
  const races = values
    .trim()
    .split(" ")
    .filter((a) => !!a.trim())
    .map(Number);
  return {
    label: label.trim(),
    races,
  } as any;
});

const [time, distance] = inputs as [Input<"Time">, Input<"Distance">];

function* holdTimes(
  time: Input<"Time">,
  distance: Input<"Distance">
): Generator<number> {
  const { races } = time;
  const { races: races2 } = distance;

  for (let i = 0; i < races.length; i++) {
    const duration = races[i];
    const record = races2[i];
    let solutions = 0;

    for (let i = 0; i <= duration; i++) {
      const acceleration = i;
      const remainingTime = duration - i;
      const distance = acceleration * remainingTime;

      if (distance <= record) continue;
      solutions++;
    }

    yield solutions;
    solutions = 0;
  }
}

const options = Array.from(holdTimes(time, distance));

console.log(options);

const result = options.reduce((a, b) => a * b, 1);

console.log(result);
