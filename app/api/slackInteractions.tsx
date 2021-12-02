import { BlitzApiHandler } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import { getSlackUserInfo, postMessageToSlack } from "integrations/slack/slackUtils"
import {
  getWizeUserFromSlack,
  getProjectWithSlackUser,
  handleVote,
} from "integrations/slack/dbUtils"
import { TrafficOutlined } from "@material-ui/icons"

const handler: BlitzApiHandler = (req, res) => {
  if (req.method === "POST") {
    //slack code
    if (req.body) {
      ;(async () => {
        try {
          await handleSlackRequest(req, res)
        } catch (error) {
          postMessageToSlack("Sorry, an error ocurred...", req, false)
            .then(() => {
              res.statusCode = 200
              res.end()
            })
            .catch((e) => console.error(e))
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
    const slackUser = await getSlackUserInfo(req, true)

    if (!slackUser.ok) {
      postMessageToSlack("Sorry, an error ocurred...", req, body)
        .then(() => {
          return
        })
        .catch((e) => console.error(e))
    }

    const wizeUser = await getWizeUserFromSlack(req, slackUser)

    if (!wizeUser) {
      postMessageToSlack("Sorry, an error ocurred...", req, body)
        .then(() => {
          return
        })
        .catch((e) => console.error(e))
    }

    const project = await getProjectWithSlackUser(req, wizeUser)

    if (!project) {
      postMessageToSlack("Sorry, an error ocurred...", req, body)
        .then(() => {
          return
        })
        .catch((e) => console.error(e))
    }

    const haveIVoted = await handleVote(project, wizeUser, req)

    const msg = haveIVoted
      ? `Thanks, ${slackUser.user.profile.first_name}, you had already liked that project, so you unliked it`
      : `Thanks, ${slackUser.user.profile.first_name}, you liked the project`

    postMessageToSlack(msg, req, body)
      .then(() => {
        return
      })
      .catch((e) => console.error(e))
  }
}

export default handler
