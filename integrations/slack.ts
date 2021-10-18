import axios from "axios"

const SLACK_WEBHOOK = ""

const BASE_URL = process.env && process.env.BASE_URL

export class SlackMessageError extends Error {
  name = "SlackMessageError"
  message = "Could not send slack notification"
}

export const SlackNotification = async (project: any) => {
  if (!SLACK_WEBHOOK) {
    console.log("Slack notifications are not available")
  } else {
    await axios
      .post(
        SLACK_WEBHOOK,
        {
          text: "A new proposal was created",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `A new proposal was created:\n*<${BASE_URL}/projects${project.id}| ${project.name}>*`,
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Description:*\n${project.description}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Status:*\n${project.status}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Votes:*\n${project.votesCount}`,
                },
              ],
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Upvote",
                  },
                  style: "primary",
                  value: "click_me_123",
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        console.log("Notification sent to slack")
      })
      .catch((err) => {
        throw new SlackMessageError()
      })
  }
}
