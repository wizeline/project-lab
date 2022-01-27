import React, { useState } from "react"
import { useMutation, invalidateQuery } from "blitz"
import {
  Container,
  Grid,
  Typography,
  IconButton,
  Dialog,
  Button,
  Alert,
  Snackbar,
  Paper,
  TextField,
} from "@mui/material"
import { CommentForm } from "app/projects/components/CommentForm"
import deleteComment from "app/projects/mutations/deleteComment"
import updateComment from "app/projects/mutations/updateComment"
import createComment from "app/projects/mutations/createComment"
import getComments from "app/projects/queries/getComments"
// import Close from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { WrapperDialog, Button as ButtonQuick } from "./Comments.styles"

import ConfirmationModal from "app/core/components/ConfirmationModal"
import CommentItem from "./CommentItem"
import { IComment } from "./CommentInterfaces"
import { useCommentsByProjectId } from "./hooks/useComments"
interface IProps {
  projectId: string
}
const initialComment: IComment = {
  id: "",
  body: "",
  projectId: "",
}

const Comments = (props: IProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openEditComment, setOpenEditComment] = useState<boolean>(false)
  const [commentSelected, setCommentSelected] = useState<IComment>(initialComment)
  const [inputCommentEdit, setInputCommentEdit] = useState<string | null>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")

  const comments = useCommentsByProjectId(props.projectId)

  const [deleteCommentMutation] = useMutation(deleteComment, {
    onSuccess: async () => {
      await invalidateQuery(getComments)
    },
  })

  const [updateCommentMutation] = useMutation(updateComment, {
    onSuccess: async () => {
      await invalidateQuery(getComments)
    },
  })

  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: async () => {
      await invalidateQuery(getComments)
    },
  })

  const createCommentHandler = async (values) => {
    try {
      const comment = await createCommentMutation({
        projectId: props.projectId!,
        body: values.comment,
        parentId: null,
      })
      values.comment = ""
      setAlertMessage("Comment saved successfully!")
      setShowAlert(true)
    } catch (error) {
      console.error(error)
    }
  }

  const editCommentModalHandler = (id: string) => {
    const comment = comments.find((comment) => comment.id === id)
    if (comment) {
      setInputCommentEdit(comment.body!)
      setCommentSelected(comment)
      setOpenEditComment(true)
    }
  }

  const saveEditCommentHandler = async () => {
    const updatedComment = { ...commentSelected }
    delete updatedComment.author
    delete updatedComment.children
    updatedComment.body = inputCommentEdit!
    const comment = await updateCommentMutation(updatedComment)
    if (comment) {
      setOpenEditComment(false)
      setAlertMessage("Comment saved successfully!")
      setShowAlert(true)
    }
  }

  const deleteCommentHandler = async () => {
    setOpenDeleteModal(false)
    await deleteCommentMutation({ id: commentSelected.id })
    setAlertMessage("Comment deleted successfully!")
    setShowAlert(true)
  }
  return (
    <Container>
      <ConfirmationModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
        label="Delete"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteCommentHandler()
        }}
      >
        <h2>Are you sure you want to delete this comment?</h2>
        <p>This action cannot be undone.</p>
        <br />
      </ConfirmationModal>
      <Snackbar open={showAlert}>
        <Alert
          severity="success"
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
          {alertMessage}
        </Alert>
      </Snackbar>
      <big>Comments</big>
      <Grid>
        <Grid>
          <CommentForm
            submitText="Add Comment"
            onSubmit={(values) => createCommentHandler(values)}
          />
          <Paper sx={{ paddingX: 7, paddingY: 5, marginTop: 2 }}>
            {comments &&
              comments.map((comment) => {
                if (!comment.parentId) {
                  return (
                    <CommentItem
                      key={comment.id}
                      projectId={props.projectId}
                      setOpenDeleteModal={setOpenDeleteModal}
                      setCommentSelected={setCommentSelected}
                      editCommentModalHandler={editCommentModalHandler}
                      comment={comment}
                    />
                  )
                }
              })}
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={openEditComment}>
        <WrapperDialog>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your comment
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ width: 540 }}
              id="update_comment"
              name="update_comment"
              onChange={(e) => setInputCommentEdit(e.target.value)}
              value={inputCommentEdit}
              placeholder="Write a comment"
            />
          </Grid>
          <Grid item sx={{ margin: 3, float: "right" }}>
            <Button
              onClick={() => {
                setOpenEditComment(false)
              }}
            >
              {" "}
              Cancel{" "}
            </Button>
            <ButtonQuick onClick={saveEditCommentHandler}>Save</ButtonQuick>
          </Grid>
        </WrapperDialog>
      </Dialog>
    </Container>
  )
}
export default Comments
