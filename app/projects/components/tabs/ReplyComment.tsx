import { TextField, Alert, IconButton, Snackbar } from "@mui/material"
import { Close } from "@mui/icons-material"

import { ReplyComponentContent } from "./ReplyComment.style"
import { ReplyActions, SaveReplyButton } from "./Comments.styles"
import useReply from "./hooks/useReply"
interface IProps {
  parentId?: string
  projectId: string
}

const ReplyComment = (props: IProps) => {
  const [commentInput, setCommentInput, createCommentHandler, showAlert, setShowAlert] = useReply(
    props.projectId,
    props.parentId
  )

  return (
    <ReplyComponentContent className="active">
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
        onChange={(e) => {
          setCommentInput(e.target.value)
        }}
        sx={{ width: 540 }}
        name={`reply_${props.parentId}`}
        placeholder="Write a reply..."
        value={commentInput}
        required
      />
      <ReplyActions>
        <SaveReplyButton onClick={() => createCommentHandler()}> Submit</SaveReplyButton>
      </ReplyActions>
    </ReplyComponentContent>
  )
}

export default ReplyComment
