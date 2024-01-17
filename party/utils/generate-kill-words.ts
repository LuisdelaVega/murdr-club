import { faker } from "@faker-js/faker";
import { getSeedFromId } from "./get-seed-from-id";

const WORD_OPTIONS: {
  length?:
    | number
    | {
        min: number;
        max: number;
      }
    | undefined;
  strategy?:
    | "fail"
    | "closest"
    | "shortest"
    | "longest"
    | "any-length"
    | undefined;
} = {
  length: { min: 5, max: 9 },
  strategy: "closest",
};

export function generateKillWords(id: string) {
  faker.seed(getSeedFromId(id));

  return [
    faker.word.sample(WORD_OPTIONS),
    faker.word.sample(WORD_OPTIONS),
    faker.word.sample(WORD_OPTIONS),
  ];
}
