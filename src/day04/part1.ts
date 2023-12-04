import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

// TODO: Complete Part 1
const parse = (input: string[]) => {
  return input.map((line) => {
    const [card, numbers] = line.split(":");
    const cardId = card.replace("Card ", "");
    const [need, have] = numbers.split("|");
    const needNumbers = new Set(
      need
        .split(" ")
        .filter((a) => !!a.trim())
        .map((a) => parseInt(a))
    );

    const haveNumbers = new Set(
      have
        .split(" ")
        .filter((a) => !!a.trim())
        .map((a) => parseInt(a.trim()))
    );

    return {
      cardId,
      needNumbers,
      haveNumbers,
    };
  });
};

const cards = parse(input);
console.log(cards);

const scores = cards.map(({ needNumbers, haveNumbers }) => {
  const intersection = new Set(
    [...needNumbers].filter((x) => haveNumbers.has(x))
  );

  if (intersection.size === 0) return 0;

  const score = Math.pow(2, intersection.size - 1);
  return score;
});

const total = scores.reduce((a, b) => a + b, 0);

console.log(total);
