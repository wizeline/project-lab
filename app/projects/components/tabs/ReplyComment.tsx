import { useState } from "react"
import { TextField } from "@material-ui/core"
import createComment from "app/projects/mutations/createComment"
import { useMutation, invalidateQuery } from "blitz"
import getComments from "app/projects/queries/getComments"
import { ReplyComponentContent } from "./ReplyComment.style"
import { ReplyActions, SaveReplyButton, ReplyButton } from "./Comments.styles"

interface IProps {
  parentId?: string
  projectId: string
  isActive: boolean
  cancelReply: any
}

const ReplyComment = (props: IProps) => {
  const [commentInput, setCommentInput] = useState<string>("")
  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: async () => {
      await invalidateQuery(getComments)
    },
  })

  const createCommentHandler = async () => {
    try {
      const comment = await createCommentMutation({
        projectId: props.projectId!,
        body: commentInput,
        parentId: props.parentId!,
      })
      setCommentInput("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ReplyComponentContent className={props.isActive && "active"}>
      <TextField
        onChange={(e) => {
          setCommentInput(e.target.value)
        }}
        sx={{ width: 540 }}
        name="body"
        multiline
        placeholder="Write a reply..."
        value={commentInput}
      />
      <ReplyActions>
        <ReplyButton onClick={props.cancelReply}>Cancel</ReplyButton>
        <SaveReplyButton onClick={() => createCommentHandler()}> Save </SaveReplyButton>
      </ReplyActions>
    </ReplyComponentContent>
  )
}

export default ReplyComment
