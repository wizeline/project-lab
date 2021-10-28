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
  projectStatus: z.object({ name: z.string() }).optional(),
  category: z.object({ name: z.string() }).optional(),
  owner: z.object({ id: z.string() }),
  skills: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
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

const extractSearchSkills = (val) => {
  val.searchSkills = val.skills?.reduce(
    (acc, item) => (acc ? `${acc}, ${item.name}` : item.name),
    ""
  )
  val.skills = val.skills?.map((item) => {
    return { id: item.id }
  })
  return val
}

export const FullCreate = z.object(FullFormFields).transform(extractSearchSkills)
export const FullUpdate = z
  .object({
    id: z.string(),
    ...FullFormFields,
  })
  .transform(extractSearchSkills)

export const UpdateVotes = z.object({
  id: z.string(),
  haveIVoted: z.boolean(),
})
