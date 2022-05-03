import axios from "axios"
import ProfileWOSDTO from "tasks/types/ProfileWOSDTO"

let WOSAccesToken: string

const catalogs = {
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
      const { filteredName, ...othersJobTitle } = jobTitle
      return { ...othersJobTitle, nameAbbreviation: jobTitle.filteredName }
    },
  },
}
const getWizelineOSApiAccessToken = async (): Promise<string> => {
  if (!process.env.WOS_AUTH_API_URL) {
    throw "Wizeline OS Authentication API URL not specified"
  }
  if (WOSAccesToken) {
    return WOSAccesToken
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

  WOSAccesToken = accessToken
  return accessToken
}

const getAllFromCatalog = async (name: string): Promise<any> => {
  return getSimpleCatalog(catalogs[name].query, name, catalogs[name].mapper)
}

const getSimpleCatalog = async (
  query: string,
  catalog: string,
  mapper: (a: any) => any
): Promise<any> => {
  const accessToken = await getWizelineOSApiAccessToken()

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

const getProfilesFromWizelineOS = async (): Promise<ProfileWOSDTO[]> => {
  const accessToken = await getWizelineOSApiAccessToken()
  let profilesToReturn = []
  if (!process.env.WOS_API_URL) {
    throw "Wizeline OS API URL not specified"
  }
  let counter = 0
  let totalProfiles = 0
  let pageSize = 25
  let includeNonBillable = true
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
          query GetProfiles($filters: ProfileFilters = { includeNonBillable: ${includeNonBillable} }, $limit: Int = ${pageSize}) {
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
      edges.map((profile: { node: { id: string; avatar: string } }) => {
        const { avatar, ...othersProfileNode } = profile.node
        let mapped = { ...othersProfileNode, avatarUrl: avatar }
        return mapped
      })
    )
  } while (counter < totalProfiles)
  return profilesToReturn
}
export { getAllFromCatalog, getProfilesFromWizelineOS }
