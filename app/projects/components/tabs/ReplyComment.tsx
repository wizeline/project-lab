import { TextField, Alert, IconButton, Snackbar } from "@mui/material"
import { Close } from "@mui/icons-material"

import { ReplyComponentContent } from "./ReplyComment.style"
import { ReplyActions, SaveReplyButton, ReplyButton } from "./Comments.styles"
import useReply from "./hooks/useReply"
interface IProps {
  parentId?: string
  projectId: string
  isActive: boolean
  cancelReply: any
}

const ReplyComment = (props: IProps) => {
  const [commentInput, setCommentInput, createCommentHandler, showAlert, setShowAlert] = useReply(
    props.projectId,
    props.parentId
  )

  return (
    <ReplyComponentContent className={props.isActive && "active"}>
      <Snackbar open={showAlert}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false)
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Reply input is required
        </Alert>
      </Snackbar>
      <TextField
        error={!commentInput}
        onChange={(e) => {
          setCommentInput(e.target.value)
        }}
        sx={{ width: 540 }}
        name="body"
        multiline
        placeholder="Write a reply..."
        value={commentInput}
        required
        helperText={!commentInput ? "Write a reply" : ""}
      />
      <ReplyActions>
        <ReplyButton onClick={props.cancelReply}>Cancel</ReplyButton>
        <SaveReplyButton onClick={() => createCommentHandler()}> Save </SaveReplyButton>
      </ReplyActions>
    </ReplyComponentContent>
  )
}

export default ReplyComment
