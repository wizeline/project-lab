import { BlitzApiHandler } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import getProject from "app/projects/queries/getProject"
import upvoteProject from "app/projects/mutations/upvoteProject"
import db from "db"
import { invokeWithMiddleware } from "blitz"

const { WebClient } = require("@slack/web-api")
const TOKEN = "xoxb-2611588638355-2611599839219-fwXj030fUtAAV7U1jN3Ic527"
const slack = new WebClient(TOKEN)

const handler: BlitzApiHandler = (req, res) => {
  if (req.method === "POST") {
    //slack code
    if (req.body) {
      ;(async () => {
        try {
          await handleSlackRequest(req, res)
        } catch (error) {
          return null
          console.error(error)
        }
      })()
      res.statusCode = 200
      res.end()
    }
  } else {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end()
  }
}

const handleSlackRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body.payload)

  const body = JSON.parse(req.body.payload)

  console.log("Object info: " + body.type)

  if (body.type === "interactive_message") {
    try {
      const slackUserInfo = await slack.users.info({
        user: body.user.id,
      })

      console.log("User search: " + slackUserInfo.user.profile.email)

      const wizeUser = slackUserInfo.user.profile
        ? await db.profiles.findFirst({
            where: { email: slackUserInfo.user.profile.email },
            select: { id: true },
          })
        : null
      const projectId = body.actions[0].value ? body.actions[0].value : null

      const project =
        projectId && wizeUser
          ? await db.projects.findFirst({
              where: { id: projectId },
              include: {
                votes: { where: { profileId: wizeUser.id } },
              },
            })
          : null

      if (wizeUser) console.log(`User: ${wizeUser.id}`)

      if (project && wizeUser) {
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

        const msg = haveIVoted
          ? `Thanks, ${slackUserInfo.user.profile.first_name}, you had already liked that project, so you unliked it`
          : `Thanks, ${slackUserInfo.user.profile.first_name}, you liked the project`

        await slack.chat.postMessage({
          text: msg,
          channel: body.channel.id,
        })
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export default handler
