import { useState } from "react"
import { useMutation, invalidateQuery } from "blitz"
import createContributorPath from "app/projects/mutations/createContributorPath"
import deleteContributorPath from "app/projects/mutations/deleteContributorPath"
import getProject from "app/projects/queries/getProject"

export const useContributorPath = () => {
  const [isLoading, setisLoading] = useState(false)
  const [createContributorPathMutation] = useMutation(createContributorPath, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
    },
  })

  const [deleteContributorPathMutation] = useMutation(deleteContributorPath, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
    },
  })

  const createContributorPathHandler = async (
    projectMemberId: string,
    projectTaskId: string,
    projectStageId: string
  ) => {
    setisLoading(true)
    try {
      await createContributorPathMutation({
        projectMemberId,
        projectTaskId,
        projectStageId,
      })
      setisLoading(false)
    } catch (e: any) {
      console.error(e)
      setisLoading(false)
    }
  }

  const deleteContributorPathHandler = async (contributorPathId: string) => {
    setisLoading(true)
    try {
      await deleteContributorPathMutation({ id: contributorPathId })
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
    }
  }

  return { isLoading, createContributorPathHandler, deleteContributorPathHandler }
}
export default useContributorPath
