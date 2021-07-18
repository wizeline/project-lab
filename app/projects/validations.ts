import { z } from "zod"

export const QuickCreate = z.object({
  name: z.string(),
  description: z.string().optional(),
  valueStatement: z.string().optional(),
})
