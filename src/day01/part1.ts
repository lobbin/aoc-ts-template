import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

// TODO: Complete Part 1
const calibrationValues = input.map((line) => {
  const digits = new Array(2);

  for (const char of line) {
    const num = parseInt(char);
    if (isNaN(num)) {
      continue;
    }

    if (digits[0] === undefined) {
      digits[0] = num;
    } else {
      digits[1] = num;
    }
  }

  if (digits[1] === undefined) {
    digits[1] = digits[0];
  }

  return parseInt(digits.join(""));
});

const sum = calibrationValues.reduce((acc, curr) => acc + curr, 0);

console.log(sum);
