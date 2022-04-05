import { z } from "zod"

export const InitialMembers = (profileId) => {
  return profileId
    ? [
        {
          profileId,
          name: "You ;-)",
          role: "Owner",
          active: true,
          hoursPerWeek: 40,
        },
      ]
    : []
}

const projectMembers = z
  .array(
    z.object({
      id: z.string().optional(),
      profileId: z.string(),
      role: z.string().nullish(),
      profile: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
        })
        .optional(),
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
  repoUrl: z.string().nullish(),
  slackChannel: z.string().nullish(),
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

const ContributorPathFields = {
  id: z.string().optional(),
  name: z.string(),
  criteria: z.string(),
  mission: z.string(),
  position: z
    .string()
    .transform((val) => (val ? parseInt(val) : null))
    .or(z.number()),
  projectId: z.string(),
  projectTasks: z.array(
    z.object({
      id: z.string().optional(),
      projectStageId: z.string(),
      description: z.string(),
      position: z
        .string()
        .transform((val) => (val ? parseInt(val) : null))
        .or(z.number()),
    })
  ),
  isNewStage: z.boolean().optional(),
}

export const ContributorPath = z.array(z.object(ContributorPathFields)).nonempty()

export const FullUpdate = z
  .object({
    id: z.string(),
    isAdmin: z.boolean(),
    owner: z.object({ id: z.string() }),
    existedMembers: z.array(z.string()),
    ...FullFormFields,
  })
  .transform(extractSearchSkills)

export const UpdateVotes = z.object({
  id: z.string(),
  haveIVoted: z.boolean(),
})

export const validateIsTeamMember = (session, data) => {
  //validate if the user have permissions (team member or owner of the project)
  const { profileId } = session
  const isProjectMember = data.projectMembers.some((member) => member.profileId === profileId)
  const isProjectOwner = profileId === data.owner?.id

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("You don't have permission to perform this operation")
  }
}
export const CreateComment = z.object({
  projectId: z.string(),
  body: z.string(),
  parentId: z.string().or(z.null()),
})

export const CreateContributorPath = z.object({
  projectTaskId: z.string(),
  projectMemberId: z.string(),
  projectStageId: z.string(),
})

export const CreateProjectMember = z.object({
  projectId: z.any(),
  hoursPerWeek: z.number(),
  role: z.string(),
})

export const UpdateProjectsCategory = z.object({
  categoryName: z.object({ name: z.string() }),
})

export const UpdateProjectsStatus = z.object({
  status: z.object({ name: z.string() }),
})
