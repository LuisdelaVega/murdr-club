import { ShortUniqueIdOptions } from "short-unique-id";
import * as z from "zod";

export const shortUniqueIdOptions: Partial<ShortUniqueIdOptions> = {
  dictionary: "alphanum_upper",
  length: 6,
};

export const ZOD_STRING = {
  schema: z
    .string()
    .regex(/^[a-zA-Z0-9]*$/, "Only letters and numbers are allowed")
    .toUpperCase()
    .trim(),
};
