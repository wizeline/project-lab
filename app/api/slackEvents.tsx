import { BlitzApiHandler, BlitzApiRequest, BlitzApiResponse } from "blitz"
import {
  checkSlackToken,
  sendProjectCard,
  postMessageToSlack,
  checkUserSession,
  SendSlackNotification,
  getSlackUserInfoFromEmail,
} from "integrations/slack/slackUtils"
import { getProjectWithName, searchForProjects } from "integrations/slack/dbUtils"
import { configOptions } from "final-form"

const handler: BlitzApiHandler = (req, res) => {
  if (req.method === "POST") {
    //slack code
    if (req.body) {
      ;(async () => {
        try {
          await handleSlackRequest(req, res)
        } catch (error) {
          postMessageToSlack("Sorry, an error ocurred...", req).catch((e) => console.error(e))
        }
      })()

      if (req.body.challenge) {
        res.end(req.body.challenge)
      } else res.statusCode = 200
    } else res.statusCode = 400
  } else res.statusCode = 404

  res.end()
}

const handleSlackRequest = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.body.challenge) {
    checkSlackToken(req) ? (res.statusCode = 200) : (res.statusCode = 401)
    res.setHeader("Content-Type", "text/plain")
  } else {
    const { headers } = req
    let sessionIsValid = true

    // When call comes from web app
    if (headers["anti-csrf"]) {
      sessionIsValid = await checkUserSession(req, res)
      if (!sessionIsValid) return
    } else {
      // If call comes from Slack, check token
      if (!checkSlackToken(req)) return
    }

    if (req.body.type === "event_callback") {
      const inputData = req.body.event.text.split(" ")

      // Looking for "Info name/search [project-name]"
      if (inputData.length < 4) {
        await postMessageToSlack(
          "Incorrect number of arguments. Use: Info name/search [project-name]",
          req
        )
        return
      }

      // Project names with spaces
      if (inputData.length > 4) inputData[3] = inputData.slice(3, inputData.length).join(" ")

      const mode = inputData[1]
      const type = inputData[2]
      const searchString = inputData[3]

      if (mode === "Info") {
        if (type == "name") {
          const project = await getProjectWithName(searchString)

          if (!project) {
            await postMessageToSlack("Sorry... I couldn't find that project", req)
            return
          }

          const userData = await getSlackUserInfoFromEmail(project.owner.email)

          sendProjectCard(req, project, userData)
            .then(() => {
              return
            })
            .catch((e) => console.error(e))
        } else if (type == "search") {
          const projects = await searchForProjects(searchString)

          if (projects.length === 0) {
            await postMessageToSlack("Sorry... there are no projects with a similar name", req)
            return
          }

          let userPromises = new Array<Promise<any>>()
          let promiseArr = new Array<Promise<void>>()

          // Need slack ids for every project owner
          for (const proj of projects)
            userPromises.push(getSlackUserInfoFromEmail(proj.owner.email))

          // Trying to resolve here
          Promise.all(userPromises)
            .then((values) => {
              // Adding each one to project cards
              for (let x = 0; x < projects.length; x++)
                promiseArr.push(sendProjectCard(req, projects[x], values[x]))

              // Again trying to resolve sending to slack
              Promise.all(promiseArr)
                .then(() => {
                  return
                })
                .catch((e) => console.error(e))
            })
            .catch((e) => console.error(e))
        }
      } else {
        await postMessageToSlack("Please use: Info name/search {project-name}", req)
        return
      }
    }

    if (req.body.type === "slack_notification") {
      const isSession = await checkUserSession(req, res)
      if (isSession)
        SendSlackNotification(req.body)
          .then(() => {
            return
          })
          .catch((e) => console.error(e))
    }
  }
}

export default handler