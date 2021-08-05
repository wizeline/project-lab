import axios from "axios"
import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"

const myEnv = dotenv.config()
dotenvExpand(myEnv)
const db = new PrismaClient()

async function task() {
  let skillsFromWizelineOs: string[]
  try {
    skillsFromWizelineOs = await getSkillsFromWizelineOS()
  } catch (e) {
    console.error(e)
    return
  }

  await db.skills.deleteMany({ where: { name: { in: skillsFromWizelineOs } } })

  if (!skillsFromWizelineOs || skillsFromWizelineOs.length == 0) {
    console.info("No skills found on Wizeline OS with filter criteria")
    return
  }

  if (skillsFromWizelineOs.length == 0) {
    console.info("No new skills to insert")
    return
  }

  const upserts = skillsFromWizelineOs.map((skill) => {
    return db.skills.upsert({
      where: { name: skill },
      update: {},
      create: { name: skill },
    })
  })
  await db.$transaction(upserts)
  console.info(`Inserted/Updated ${skillsFromWizelineOs.length} new skill(s)`)
}

async function getSkillsFromWizelineOS(): Promise<string[]> {
  const accessToken = await getWizelineOSApiAccessToken()

  if (!process.env.WOS_API_URL) {
    throw "Wizeline OS API URL not specified"
  }
  let {
    data: {
      data: { skills = [] },
    },
  } = await axios.post(
    process.env.WOS_API_URL,
    {
      query: `
        query GetSkills {
          skills {
            name
            createdAt
          }
        }
      `,
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!skills || skills.length == 0) {
    throw "No skills retrived by Wizeline OS API"
  }

  return skills.map((skill: { name: string }) => {
    return skill.name
  })
}

async function getWizelineOSApiAccessToken(): Promise<string> {
  if (!process.env.WOS_AUTH_API_URL) {
    throw "Wizeline OS Authentication API URL not specified"
  }
  let {
    data: { access_token: accessToken = "" },
  } = await axios.post(process.env.WOS_AUTH_API_URL, {
    grant_type: "client_credentials",
    audience: process.env.WOS_AUTH_API_AUDIENCE,
    client_id: process.env.WOS_AUTH_API_CLIENT_ID,
    client_secret: process.env.WOS_AUTH_API_CLIENT_SECRET,
  })
  if (!accessToken) {
    throw "Unable to get access token to request skills from Wizeline OS"
  }

  return accessToken
}

//export default task
task().finally(() => {
  db.$disconnect()
})
