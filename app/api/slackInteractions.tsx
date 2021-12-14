import { BlitzApiHandler, BlitzApiRequest, BlitzApiResponse } from "@blitzjs/core"
import { getSlackUserInfo, postMessageToSlack, getBodyFromReq } from "integrations/slack/slackUtils"
import {
  getWizeUserFromSlack,
  getProjectWithSlackUser,
  handleVote,
} from "integrations/slack/dbUtils"

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

const handleSlackRequest = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const body = getBodyFromReq(req)

  if (body.type === "block_actions") {
    const slackUser = await getSlackUserInfo(req, true)

    if (!slackUser.ok) {
      await postMessageToSlack("Sorry, an error ocurred...", req, body)
      return
    }

    const wizeUser = await getWizeUserFromSlack(req, slackUser)

    if (!wizeUser) {
      await postMessageToSlack("Sorry, an error ocurred...", req, body)
      return
    }

    const project = await getProjectWithSlackUser(req, wizeUser)

    if (!project) {
      await postMessageToSlack("Sorry, an error ocurred...", req, body)
      return
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
