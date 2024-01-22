// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {formatDay, setupDay} from './util/index.js';
import {parse} from 'ts-command-line-args';

type CliArguments = {
  day: string;
  part: string;
};

const optionDefinitions = {
  day: String,
  part: String,
};
const options = parse<CliArguments>(optionDefinitions);
process.env.npm_config_day = options.day;
process.env.npm_config_part = options.part;

const day = Number(process.env.npm_config_day ?? 0);
const part = Number(process.env.npm_config_part ?? 0);

const outputSolution = async (part: number) => {
  let solution = await import(`./day${formatDay(day)}/part${part}.js`).then(
    s => s.default
  );
  if (typeof solution === 'function') {
    solution = await solution();
  }
  console.log(`Day ${day} | Part ${part} - Solution: ${solution}`);
};

const validate = (type: 'day' | 'part', num: number, max: number) => {
  if (num < 1 || num > max + 1)
    throw new Error(
      `The ${type} must be number between 1 and ${max}, you entered ${num}`
    );
};

validate('day', day, 25);
validate('part', part, 2);

// for (let index = 0; index < 25; index++) {
//   setupDay(index + 1);
// }

outputSolution(part);
