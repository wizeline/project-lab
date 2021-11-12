import { useSession } from "blitz"
import { useState, useEffect } from "react"

export const useSessionUserIsProjectTeamMember = (project) => {
  const [isProjectTeamMember, setIsProjectTeamMember] = useState(null)
  const session = useSession()

  useEffect(() => {
    if (session && project) {
      const { profileId } = session
      const isProjectMember = project.projectMembers.some((p) => p.profileId === profileId)
      const isProjectOwner = profileId === project.ownerId

      setIsProjectTeamMember(isProjectOwner || isProjectMember)
    }
  }, [project, session])
  return isProjectTeamMember
}
