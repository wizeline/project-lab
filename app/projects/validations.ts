import { z } from "zod"

export const QuickCreate = z.object({
  name: z.string(),
  description: z.string().nullable(),
  valueStatement: z.string().nullable(),
})

export const FullCreate = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  valueStatement: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  skills: z.array(
    z.object({
      id: z.string(),
    })
  ),
  labels: z.array(
    z.object({
      id: z.string(),
    })
  ),
})
