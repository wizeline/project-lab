import { z } from "zod"

export const QuickCreate = z.object({
  name: z.string(),
  description: z.string().nullable(),
  valueStatement: z.string().nullable(),
})

export const FullCreate = z.object({
  name: z.string(),
  description: z.string().nullable(),
  valueStatement: z.string().nullable(),
  target: z.string().nullable(),
})
