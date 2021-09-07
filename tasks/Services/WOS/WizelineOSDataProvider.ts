import axios from "axios"
import ProfileWOSDTO from "tasks/types/ProfileWOSDTO"

export default class WizelineOSDataProvider {
  WOSAccesToken: string
  constructor() {
    this.WOSAccesToken = ""
  }

  catalogs = {
    skills: {
      query: `
      query GetSkills {
        skills {
          id
          name
        }
      }
    `,
      mapper: (skill: { id: string; name: string }) => {
        return { ...skill }
      },
    },
    locations: {
      query: `
      query GetLocations {
        locations {
          id,
          name
        }
      }
    `,
      mapper: (locations: { id: string; name: string }) => {
        return { ...locations }
      },
    },
    jobTitles: {
      query: `
      query GetJobTitles {
        jobTitles {
          id,
          name,
          filteredName
        }
      }
    `,
      mapper: (jobTitle: { id: string; name: string; filteredName: string }) => {
        return { ...jobTitle, nameAbbreviation: jobTitle.filteredName }
      },
    },
  }
  async getWizelineOSApiAccessToken(): Promise<string> {
    if (!process.env.WOS_AUTH_API_URL) {
      throw "Wizeline OS Authentication API URL not specified"
    }
    if (this.WOSAccesToken) {
      return this.WOSAccesToken
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

    this.WOSAccesToken = accessToken
    return accessToken
  }

  async getAllFromCatalog(name: string): Promise<any> {
    return this.getSimpleCatalog(this.catalogs[name].query, name, this.catalogs[name].mapper)
  }

  async getSimpleCatalog(query: string, catalog: string, mapper: (a: any) => any): Promise<any> {
    const accessToken = await this.getWizelineOSApiAccessToken()

    if (!process.env.WOS_API_URL) {
      throw "Wizeline OS API URL not specified"
    }
    let response = await axios.post(
      process.env.WOS_API_URL,
      {
        query: query,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    )
    let catalogData = response.data.data[catalog]
    if (!catalogData || catalogData.length == 0) {
      throw `No ${catalog} retrieved by Wizeline OS API`
    }
    return catalogData.map(mapper)
  }

  async getProfilesFromWizelineOS(): Promise<ProfileWOSDTO[]> {
    const accessToken = await this.getWizelineOSApiAccessToken()
    let profilesToReturn = []
    if (!process.env.WOS_API_URL) {
      throw "Wizeline OS API URL not specified"
    }
    let counter = 0
    let totalProfiles = 0
    let pageSize = 25
    do {
      let {
        data: {
          data: {
            profiles: { totalCount, edges = [] },
          },
        },
      } = await axios.post(
        process.env.WOS_API_URL,
        {
          query: `
          query GetProfiles($filters: ProfileFilters, $limit: Int = ${pageSize}) {
            profiles(first: $limit, after: "${counter}", filters: $filters) {
              totalCount
              edges {
                node {
                  id
                  email
                  firstName
                  lastName
                  avatar
                  jobTitleId
                  jobTitle
                  jobLevelTier
                  department
                  terminatedAt
                  locationId
                  skills {
                    level
                    skill{
                      id
                    }
                  }
                }
              }
            }
          }`,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!edges || edges.length == 0) {
        throw "No profiles retrieved by Wizeline OS API"
      }

      totalProfiles = totalCount
      counter += edges.length
      profilesToReturn = profilesToReturn.concat(
        edges.map((profile: { node: { id: string; skills: any } }) => {
          let profileSkills = profile.node.skills.map(
            (skillRelationship: { level: string; skill: { id: string } }) => {
              return {
                skills: { connect: { id: skillRelationship.skill.id } },
                proficiency: skillRelationship.level,
              }
            }
          )
          let mapped = { ...profile.node, profileSkills: profileSkills }
          delete mapped.skills
          return mapped
        })
      )
    } while (counter < totalProfiles)
    return profilesToReturn
  }
}
