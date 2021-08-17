import axios from "axios"

export default class WizelineOSDataProvider {
  constructor() {}
  async getWizelineOSApiAccessToken(): Promise<string> {
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
      throw "Unable to get access token to request information from Wizeline OS"
    }

    return accessToken
  }

  async getJobTitlesFromWizelineOS(): Promise<
    {
      id: string
      name: string
      nameAbbreviation: string
    }[]
  > {
    const accessToken = await this.getWizelineOSApiAccessToken()
    if (!process.env.WOS_API_URL) {
      throw "Wizeline OS API URL not specified"
    }
    let {
      data: {
        data: { jobTitles = [] },
      },
    } = await axios.post(
      process.env.WOS_API_URL,
      {
        query: `
          query GetJobTitles {
            jobTitles {
              id,
              name,
              filteredName
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
    if (!jobTitles || jobTitles.length == 0) {
      throw "No job titles retrived by Wizeline OS API"
    }

    return jobTitles.map((jobTitle: { id: string; name: string; filteredName: string }) => {
      return { ...jobTitle, nameAbbreviation: jobTitle.filteredName }
    })
  }

  async getSkillsFromWizelineOS(): Promise<
    {
      id: string
      name: string
    }[]
  > {
    const accessToken = await this.getWizelineOSApiAccessToken()

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
              id
              name
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

    return skills.map((skill: { id: string; name: string }) => {
      return { ...skill }
    })
  }

  async getLocationsFromWizelineOS(): Promise<
    {
      id: string
      name: string
    }[]
  > {
    const accessToken = await this.getWizelineOSApiAccessToken()

    if (!process.env.WOS_API_URL) {
      throw "Wizeline OS API URL not specified"
    }
    let {
      data: {
        data: { locations = [] },
      },
    } = await axios.post(
      process.env.WOS_API_URL,
      {
        query: `
          query GetLocations {
            locations {
              id,
              name
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
    if (!locations || locations.length == 0) {
      throw "No locations retrived by Wizeline OS API"
    }
    return locations.map((locations: { id: string; name: string }) => {
      return { ...locations }
    })
  }
}
