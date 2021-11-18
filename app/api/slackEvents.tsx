import { BlitzApiHandler } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import db from "db"
import {
  checkSlackToken,
  sendProjectCard,
  getProjectWithName,
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
      if (req.body.challenge) {
        res.end(req.body.challenge)
      } else {
        res.statusCode = 200
        res.end()
      }
    }
  } else {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ name: "John Doe" }))
  }
}

const handleSlackRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.challenge) return checkSlackToken(req, res)
  else {
    console.log(req.body)
    if (req.body.type === "event_callback") {
      if (req.body.event.text.includes("Info")) {
        const name = req.body.event.text.split(" ")[2]
        const project = await getProjectWithName(name)
        console.log("Sending ID: " + project.name)
        sendProjectCard(req, project)
      }
    }
  }
}

export default handler
