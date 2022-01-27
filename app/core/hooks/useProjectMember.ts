import { useSession } from "blitz"
import { useState, useEffect } from "react"

interface IProjectMember {
  id: string
  projectId: string
  profileId: string
  contributorPath: any
}

const initialState = {
  id: "",
  projectId: "",
  profileId: "",
  contributorPath: [],
}
export const useProjectMember = (project) => {
  const [projectTeamMember, setProjectTeamMember] = useState<IProjectMember>(initialState)
  const session = useSession()

  useEffect(() => {
    if (session && project) {
      const projectMember = project.projectMembers.find((p) => p.profileId === session.profileId)
      setProjectTeamMember(projectMember)
    }
  }, [project, session])
  return { projectTeamMember }
}
