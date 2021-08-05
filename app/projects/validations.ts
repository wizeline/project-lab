import { z } from "zod"

export const QuickCreate = z.object({
  name: z.string(),
  description: z.string().nullish(),
  valueStatement: z.string().nullish(),
})

export const FullFormFields = {
  name: z.string(),
  description: z.string().nullish(),
  valueStatement: z.string().nullish(),
  target: z.string().nullish(),
  skills: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  labels: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  projectMembers: z
    .array(
      z.object({
        profileId: z.string(),
        role: z.string().nullish(),
        // https://github.com/colinhacks/zod/discussions/330
        hoursPerWeek: z
          .string()
          .nullish()
          .refine((val) => !val || /^\d+$/.test(val), {
            message: "Hours per week must be an integer",
            path: ["projectMembers"],
          })
          .transform((val) => (val ? parseInt(val) : null)),
        active: z.boolean().nullish(),
      })
    )
    .optional(),
}

export const FullCreate = z.object(FullFormFields)
export const FullUpdate = z.object({
  id: z.string(),
  ...FullFormFields,
})
