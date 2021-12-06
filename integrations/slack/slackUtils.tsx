import { NextApiRequest, NextApiResponse } from "next"
const { WebClient } = require("@slack/web-api")
import { AnyObject } from "react-final-form"
import { AnyZodObject } from "zod"
import { getSession, BlitzApiRequest, BlitzApiResponse } from "blitz"

const slack = new WebClient(process.env.APP_TOKEN)
const slack_channel = process.env && process.env.SLACK_CHANNEL

const getProjectCard = (project: any): Array<any> => {
  return [
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
            text: "Like :thumbsup:",
          },
          value: project.id,
        },
      ],
    },
  ]
}

export const checkSlackToken = (req: NextApiRequest): boolean => {
  // Get token from env
  return req.body.token === process.env.SLACK_TOKEN ? true : false
}

export const checkUserSession = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const userSession = await getSession(req, res)

  return userSession && userSession.userId ? true : false
}

export const getBodyFromReq = (req: NextApiRequest) => {
  const body = JSON.parse(req.body.payload)
  return body
}

export const sendProjectCard = async (req: NextApiRequest, project: AnyObject) => {
  await slack.chat.postMessage({
    text: "Hi",
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
              text: "Like :thumbsup:",
            },
            value: project.id,
          },
        ],
      },
    ],
    channel: req.body.event.channel,
  })
}

export const sendOwnerCard = async (req: NextApiRequest, project: AnyObject) => {
  await slack.chat.postMessage({
    text: "Hi",
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${project.name}*\nProject Owner: *${project.owner.firstName} ${project.owner.lastName}*\n*${project.owner.email}*`,
        },
      },
    ],
    channel: req.body.event.channel,
  })
}

export const getSlackUserInfo = async (req: NextApiRequest, parse: boolean) => {
  const body = parse ? getBodyFromReq(req) : req
  const info = parse ? body.user.id : req.body.event.user

  const slackUserInfo = await slack.users.info({
    user: info,
  })

  return slackUserInfo
}

export const getSlackUserInfoFromEmail = async (email: string) => {
  const slackUserInfo = await slack.users.lookupByEmail({
    email: email,
  })

  return slackUserInfo
}

export const postMessageToSlack = async (msg: string, req: NextApiRequest, body?: any) => {
  const channel = typeof body !== "undefined" ? body.channel.id : req.body.event.channel

  await slack.chat.postMessage({
    text: msg,
    channel: channel,
  })
}

export const SendSlackNotification = async (project: any) => {
  return slack.chat.postMessage({
    text: "A new proposal was created",
    blocks: getProjectCard(project),
    channel: slack_channel,
  })
}
