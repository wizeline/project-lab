import { BlitzApiHandler } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import {
  checkSlackToken,
  sendProjectCard,
  sendOwnerCard,
  postMessageToSlack,
  checkUserSession,
  SendSlackNotification,
} from "integrations/slack/slackUtils"
import { getProjectWithName, searchForProjects } from "integrations/slack/dbUtils"

const handler: BlitzApiHandler = (req, res) => {
  if (req.method === "POST") {
    //slack code
    if (!req.body) {
      res.statusCode = 200
      res.end()
    }
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

    if (req.body.challenge) {
      res.end(req.body.challenge)
    } else {
      res.statusCode = 200
      res.end()
    }
    // GET
  } else {
    res.statusCode = 404
    res.end()
  }
}

const handleSlackRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.challenge) {
    checkSlackToken(req) ? (res.statusCode = 200) : (res.statusCode = 401)
    res.setHeader("Content-Type", "text/plain")
  } else {
    //console.log(req.body)
    if (!checkSlackToken(req) || !checkUserSession(req, res)) return

    if (req.body.type === "event_callback") {
      const inputData = req.body.event.text.split(" ")
      if (inputData.length < 4) {
        postMessageToSlack(
          "Incorrect number of arguments. Use: Info/Owner name/search [project-name]/[owner-name]",
          req,
          false
        )
          .then(() => {
            return
          })
          .catch((e) => console.error(e))
      }
      const mode = inputData[1]
      const type = inputData[2]
      const searchString = inputData[3]

      if (type == "name") {
        const project = await getProjectWithName(searchString)

        if (!project) {
          postMessageToSlack("Sorry... I couldn't find that project", req, false)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        }

        console.log("Sending proposal: " + project.name)

        if (mode === "Info") {
          sendProjectCard(req, project)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        } else if (mode === "Owner") {
          //send owner card
          sendOwnerCard(req, project)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        }
      } else if (type == "search") {
        const projects = await searchForProjects(searchString)

        if (projects.length === 0) {
          postMessageToSlack("Sorry... there are no projects with a similar name", req, false)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        }

        if (mode === "Info") {
          // for (const proj of projects)
          //   await sendOwnerCard(req, proj)

          let promiseArr = new Array<Promise<void>>()
          for (const proj of projects) promiseArr.push(sendProjectCard(req, proj))

          Promise.all(promiseArr)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        } else if (mode === "Owner") {
          // for (const proj of projects)
          //   await sendOwnerCard(req, proj)

          let promiseArr = new Array<Promise<void>>()
          for (const proj of projects) promiseArr.push(sendOwnerCard(req, proj))

          Promise.all(promiseArr)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        }
      }
    }

    if (req.body.type === "slack_notification") {
      SendSlackNotification(req.body)
    }
  }
}

export default handler
