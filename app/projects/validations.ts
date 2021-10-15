import { z } from "zod"

export const InitialMembers = (profileId) => {
  return profileId
    ? [
        {
          profileId,
          name: "You ;-)",
          role: "",
          active: true,
          hoursPerWeek: null,
        },
      ]
    : []
}

const projectMembers = z
  .array(
    z.object({
      profileId: z.string(),
      role: z.string().nullish(),
      hoursPerWeek: z
        // TextFields return strings
        .string()
        .nullish()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: "Hours per week must be an integer",
          path: ["projectMembers"],
        })
        .transform((val) => (val ? parseInt(val) : null))
        // to allow numbers returned by prisma
        .or(z.number()),
      active: z.boolean().nullish(),
    })
  )
  .optional()

export const QuickCreate = z.object({
  name: z.string(),
  description: z.string().nullish(),
  valueStatement: z.string().nullish(),
  projectMembers,
})

export const FullFormFields = {
  name: z.string(),
  description: z.string(),
  valueStatement: z.string(),
  target: z.string().nullish(),
  category: z.object({ name: z.string() }).optional(),
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
  projectMembers,
}

export const FullCreate = z.object(FullFormFields)
export const FullUpdate = z.object({
  id: z.string(),
  ...FullFormFields,
})

export const UpdateVotes = z.object({
  id: z.string(),
})
