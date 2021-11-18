import { NextApiRequest, NextApiResponse } from "next"
const { WebClient } = require("@slack/web-api")
const TOKEN = "xoxb-2611588638355-2611599839219-fwXj030fUtAAV7U1jN3Ic527"
import db from "db"
import { StringValidation } from "zod"
import { AnyObject } from "react-final-form"

const slack = new WebClient(TOKEN)

export const checkSlackToken = (req: NextApiRequest, res: NextApiResponse) => {
  // Get token from env
  req.body.token === "Jcrmd62XVVFDUQ8RDoG4aa65" ? (res.statusCode = 200) : (res.statusCode = 401)
  console.log("In check token: " + req.body.token)
  res.setHeader("Content-Type", "text/plain")
}

const getBodyFromReq = (req: NextApiRequest) => {
  const body = JSON.parse(req.body.payload)
  return body
}

export const sendProjectCard = async (req: NextApiRequest, project: AnyObject) => {
  try {
    const result = await slack.users.info({
      user: req.body.event.user,
    })

    console.log("User: " + result + " projectID: " + project.id)

    const msg = result.user ? `Hello, ${result.user.profile.first_name}` : "Hello, friend"
    await slack.chat.postMessage({
      text: msg,
      blocks: [
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${project.name}*\n${project.description}\n\n*Do you want to give the project a 'like'?*`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Like",
              },
              value: project.id,
            },
          ],
        },
      ],
      channel: req.body.event.channel,
    })

    console.log(`Successfully sent message ${msg}`)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getSlackUserInfo: any = async (req: NextApiRequest) => {
  const body = getBodyFromReq(req)

  const slackUserInfo = await slack.users.info({
    user: body.user.id,
  })

  console.log("SlackUser: " + JSON.stringify(slackUserInfo))
  return slackUserInfo
}

export const postMessageToSlack = async (msg: string, req: NextApiRequest) => {
  const body = getBodyFromReq(req)

  await slack.chat.postMessage({
    text: msg,
    channel: body.channel.id,
  })
}

export const getWizeUserFromSlack = async (req: NextApiRequest, slackUser: any) => {
  const wizeUser = await db.profiles.findFirst({
    where: { email: slackUser.user.profile.email },
    select: { id: true },
  })

  return wizeUser
}

export const getProjectWithSlackUser = async (req: NextApiRequest, wizeUser: any) => {
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
  })

  return project
}

export const handleVote = async (project: any, wizeUser: any, req: NextApiRequest) => {
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
