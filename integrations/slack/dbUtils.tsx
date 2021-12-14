import db from "db"
import { BlitzApiRequest } from "@blitzjs/core"
import { getBodyFromReq } from "./slackUtils"

export const getWizeUserFromSlack = async (req: BlitzApiRequest, slackUser: any) => {
  const wizeUser = await db.profiles.findFirst({
    where: { email: slackUser.user.profile.email },
    select: { id: true },
  })

  return wizeUser
}

export const getProjectWithSlackUser: any = async (req: BlitzApiRequest, wizeUser: any) => {
  const body = getBodyFromReq(req)
  const projectId = body.actions[0].value ? body.actions[0].value : null

  const project = await db.projects.findFirst({
    where: { id: projectId },
    include: {
      votes: { where: { profileId: wizeUser.id } },
    },
  })

  return project
}

export const getProjectWithName: any = async (projectName: string) => {
  const project = await db.projects.findFirst({
    where: { name: projectName },
    include: {
      owner: true,
    },
  })

  return project
}

export const searchForProjects: any = async (searchString: string) => {
  const projects = await db.projects.findMany({
    take: 3,
    where: {
      name: {
        contains: searchString,
      },
    },
    include: {
      owner: true,
    },
  })

  return projects
}

export const handleVote = async (project: any, wizeUser: any, req: BlitzApiRequest) => {
  const body = getBodyFromReq(req)
  const projectId = body.actions[0].value ? body.actions[0].value : null

  if (!projectId) return null

  const haveIVoted = project.votes.length > 0 ? true : false
  const sum = haveIVoted ? { decrement: 1 } : { increment: 1 }
  const votesAction = haveIVoted
    ? { deleteMany: [{ profileId: wizeUser.id }] }
    : { create: [{ profileId: wizeUser.id }] }

  await db.projects.update({
    where: { id: projectId },
    data: {
      votesCount: sum,
      votes: votesAction,
    },
  })

  return haveIVoted
}
