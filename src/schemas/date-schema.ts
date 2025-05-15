import { z } from "zod";

export const dateSchema = z.union([
  z.string().transform((str) => new Date(str)),
  z.date(),
]);

