import { useMutation } from "blitz"
import createProjectMember from "app/projects/mutations/createProjectMember"

const useProjectMembers = () => {
  const [createProjectMemberMutation] = useMutation(createProjectMember, {
    onSuccess: async () => {
      console.log("Project member has been saved")
    },
  })
  interface IProjectMember {
    projectId: string
    profileId?: string
    hoursPerWeek: number
    role: string
  }
  const createProjectMemberHandler = async (object: IProjectMember) => {
    const cpm = await createProjectMemberMutation(object)
    console.log("project member ", cpm)
  }
  return { createProjectMemberHandler }
}
export default useProjectMembers
