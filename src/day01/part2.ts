import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

// TODO: Complete Part 2
const normalizeString = (str: string) => {
  str = str.toLowerCase();
  return str
    .replaceAll("eightwo", "82") // input had a typo
    .replaceAll("twone", "21") // input had a typo
    .replaceAll("oneight", "18") // input had a typo
    .replaceAll("zero", "0")
    .replaceAll("one", "1")
    .replaceAll("two", "2")
    .replaceAll("three", "3")
    .replaceAll("four", "4")
    .replaceAll("five", "5")
    .replaceAll("six", "6")
    .replaceAll("seven", "7")
    .replaceAll("eight", "8")
    .replaceAll("nine", "9");
};

const parseNumericString = (str: string) => {
  const normalized = normalizeString(str);
  const numRegex = /(\d)/gi;
  const matches = normalized.matchAll(numRegex);

  const options = [];

  for (const match of matches) {
    if (match.index == null) {
      continue;
    }

    const mayBeNum = parseInt(match[0]);
    if (isNaN(mayBeNum)) {
      continue;
    }

    options.push(mayBeNum);
  }

  //53221
  if (options.length === 0) {
    throw new Error("No matches found");
  }

  const [first] = options;
  const last = options[options.length - 1];

  const result = parseInt(`${first}${last}`);

  console.log({
    source: str,
    line: normalized,
    result,
  });

  return result;
};

const calibrationValues = input.map(parseNumericString);

const sum = calibrationValues.reduce((acc, curr) => acc + curr, 0);

console.log({ sum });
