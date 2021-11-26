import { useState } from "react"
import { useMutation, invalidateQuery, useQuery } from "blitz"
import getComments from "app/projects/queries/getComments"
import deleteComment from "app/projects/mutations/deleteComment"
import updateComment from "app/projects/mutations/updateComment"
import createComment from "app/projects/mutations/createComment"

export const useCommentsByProjectId = (projectId: string) => {
  const [comments] = useQuery(getComments, {
    projectId: projectId,
  })
  return comments
}
