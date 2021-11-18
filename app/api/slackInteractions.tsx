import { BlitzApiHandler } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import getProject from "app/projects/queries/getProject"
import upvoteProject from "app/projects/mutations/upvoteProject"
import db from "db"
import {
  getSlackUserInfo,
  postMessageToSlack,
  getWizeUserFromSlack,
  getProjectWithSlackUser,
  handleVote,
} from "../../integrations/slack/slackUtils"

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

  if (body.type === "block_actions") {
    try {
      const slackUser = await getSlackUserInfo(req)

      if (!slackUser) return postMessageToSlack("An error ocurrred", req)

      const wizeUser = await getWizeUserFromSlack(req, slackUser)

      if (!wizeUser) return postMessageToSlack("An error ocurrred", req)

      const project = await getProjectWithSlackUser(req, wizeUser)

      if (!project) return postMessageToSlack("An error ocurrred", req)

      const haveIVoted = await handleVote(project, wizeUser, req)

      const msg = haveIVoted
        ? `Thanks, ${slackUser.user.profile.first_name}, you had already liked that project, so you unliked it`
        : `Thanks, ${slackUser.user.profile.first_name}, you liked the project`

      postMessageToSlack(msg, req)
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export default handler
