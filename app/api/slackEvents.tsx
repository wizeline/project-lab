import { BlitzApiHandler, useQuery } from "@blitzjs/core"
import { NextApiRequest, NextApiResponse } from "next"
import db from "db"

const SLACK_WEBHOOK =
  "https://hooks.slack.com/services/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"
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
      /*
            
            if( req.body.challenge && req.body.token === "Jcrmd62XVVFDUQ8RDoG4aa65"){
                res.statusCode = 200
                res.setHeader("Content-Type", "text/plain")
                res.end(req.body.challenge)
            }
            else {
                //console.log(req.body)
                if(req.body.event.text.includes("Hello")){  
                    (async () => {
                        try {
                            
                            const result = await slack.users.info({
                              user: req.body.event.user
                            })

                            const msg = result.user 
                                        ? `Hello, ${result.user.profile.first_name}` 
                                        : "Hello, friend";
                            
                            await slack.chat.postMessage({
                                text: msg,
                                channel: req.body.event.channel,
                            });
       
                            console.log(`Successfully sent message ${msg}`);
                     
                          }
                          catch (error) {
                            return null
                            console.error(error);
                          } 
                        
                    })()   
                     res.statusCode = 200
                     res.end()
                }
            }
            */
    }
  } else {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ name: "John Doe" }))
  }
}

const handleSlackRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.challenge && req.body.token === "Jcrmd62XVVFDUQ8RDoG4aa65") {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end(req.body.challenge)
  } else {
    console.log(req.body)
    if (req.body.type === "event_callback") {
      if (req.body.event.text.includes("Hello")) {
        try {
          const result = await slack.users.info({
            user: req.body.event.user,
          })

          const msg = result.user ? `Hello, ${result.user.profile.first_name}` : "Hello, friend"

          await slack.chat.postMessage({
            text: msg,
            attachments: [
              {
                text: "Do you want to like the project?",
                attachment_type: "default",
                callback_id: "project_like",
                actions: [
                  {
                    name: "like",
                    text: "Like",
                    type: "button",
                    value: "ded5c1e8-9f53-4e3c-b8fc-f63ec52017e3",
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
    } else if (req.body.type === "interactive_message") {
      try {
        const result = await slack.users.info({
          user: req.body.user.id,
        })

        const user = result.user.profile
          ? await db.profiles.findFirst({
              where: { email: result.user.profile.email },
              select: { id: true },
            })
          : null

        const project = user
          ? await db.projects.findFirst({
              where: { id: req.body.actions.value },
              include: {
                votes: { where: { profileId: user.id } },
              },
            })
          : null
      } catch (error) {
        console.error(error)
        return null
      }
    }
  }
}

export default handler
