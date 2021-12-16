import { useState } from "react"
import { useMutation, invalidateQuery } from "blitz"
import createComment from "app/projects/mutations/createComment"
import getComments from "app/projects/queries/getComments"

const useReply = (projectId: string, parentId: string | undefined): any[] => {
  const [commentInput, setCommentInput] = useState<string>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: async () => {
      await invalidateQuery(getComments)
    },
  })

  const createCommentHandler = async () => {
    try {
      if (commentInput.trim()) {
        const comment = await createCommentMutation({
          projectId: projectId!,
          body: commentInput,
          parentId: parentId!,
        })
        setCommentInput("")
      } else {
        setShowAlert(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [commentInput, setCommentInput, createCommentHandler, showAlert, setShowAlert]
}

export default useReply
