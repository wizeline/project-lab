import axios from "axios"

const SLACK_WEBHOOK = process.env && process.env.SLACK_NOTIFICATION_WEBHOOK
const BASE_URL = process.env && process.env.BASE_URL

export class SlackWebhookException extends Error {
  name = "SlackMessageException"
  message = "Slack notifications are not available"
}

export const SlackNotification = async (project: any) => {
  if (!SLACK_WEBHOOK) {
    throw new SlackWebhookException()
  } else {
    axios.post(
      SLACK_WEBHOOK,
      {
        text: "A new proposal was created",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `A new proposal was created:\n*<${BASE_URL}/projects/${project.id}| ${project.name}>*`,
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
  }
}
