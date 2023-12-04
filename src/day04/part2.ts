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
      cardId: Number(cardId),
      needNumbers,
      haveNumbers,
      count: 1,
    };
  });
};

const cards = new Map(parse(input).map((card) => [card.cardId, card]));

for (const [cardId, card] of cards.entries()) {
  const { cardId, needNumbers, haveNumbers } = card;
  const intersection = new Set(
    [...needNumbers].filter((x) => haveNumbers.has(x))
  );

  if (intersection.size === 0) continue;

  const start = card.cardId + 1;
  const end = card.cardId + intersection.size;

  for (const id of Array.from(
    { length: end - start + 1 },
    (_, i) => i + start
  )) {
    console.log(`Updating card ${id}`);
    const cardToUpdate = cards.get(id);
    if (!cardToUpdate) break;
    cards.set(id, {
      ...cardToUpdate,
      count: cardToUpdate.count + card.count,
    });
  }
}

const totalCards = Array.from(cards.values()).reduce((a, b) => a + b.count, 0);

console.log(totalCards);
