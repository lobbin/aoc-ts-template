import { parseInput } from "../util";

const input = parseInput<string>({
  split: { delimiter: "\n", mapper: (a) => a },
});

// TODO: Complete Part 1
const isSpace = (char: string) => {
  return char === ".";
};

const isSymbol = (char: string) => {
  if (!char) return false;
  if (isDigit(char)) return false;
  return !isSpace(char);
};

const isDigit = (char: string) => {
  if (!char) return false;
  return /\d/.test(char);
};

const maxRows = input.length;
const maxCols = input[0].length;
const numbers = [] as Number[];
const symbols = new Map<string, Symbol>();

class Symbol {
  public adjacent = new Set<Number>();

  constructor(
    public row: number,
    public col: number,
    public value: string
  ) {}

  attach(number: Number) {
    this.adjacent.add(number);
    number.attach(this);
    console.log(`Attached ${number.value} to ${this.value}`);
    return number;
  }
}

class Number {
  public adjacent = new Set<Symbol>();

  constructor(
    public row: number,
    public startCol: number,
    public endCol: number,
    public value: string
  ) {}

  attach(symbol: Symbol) {
    this.adjacent.add(symbol);
    console.log(`Attached ${symbol.value} to ${this.value}`);
    return symbol;
  }
}

const findSymbol = (row: number, col: number): Symbol | undefined => {
  // If the symbol is already found, return it
  if (symbols.has(`${row},${col}`)) {
    return symbols.get(`${row},${col}`);
  }

  const char = input[row]?.[col];
  // If the char is a symbol, then create a new symbol
  if (isSymbol(char)) {
    const symbol = new Symbol(row, col, char);
    symbols.set(`${row},${col}`, symbol);
    return symbol;
  }

  return undefined;
};

// Preproces: Extract all numbers and symbols
for (let row = 0; row < maxRows; row++) {
  for (let col = 0; col < maxCols; col++) {
    const char = input[row]?.[col];

    // When we find a number,
    // check it's boundaries for a symbol and attach it
    if (isDigit(char)) {
      let digits = "";
      const start = col;
      while (isDigit(input[row]?.[col])) {
        digits += input[row]?.[col];
        col++;
      }
      const end = col - 1;

      const num = new Number(row, start, end, digits);
      numbers.push(num);

      const left = findSymbol(row, start - 1)?.attach(num);
      const right = findSymbol(row, end + 1)?.attach(num);

      for (let i = start - 1; i <= end + 1; i++) {
        const top = findSymbol(row - 1, i)?.attach(num);
        const bottom = findSymbol(row + 1, i)?.attach(num);
      }
    }
  }
}

const results = new Set<Number>();
for (const sym of symbols.values()) {
  for (const num of sym.adjacent) {
    results.add(num);
  }
}

let sum = 0;
for (const num of results.values()) {
  sum += parseInt(num.value);
}

console.log(sum);
