import React, { useState } from "react"
import { useMutation, invalidateQuery, useSession } from "blitz"
import {
  Container,
  Grid,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  Button,
  Alert,
  Snackbar,
  Paper,
  TextField,
} from "@material-ui/core"
import { CommentForm } from "app/projects/components/CommentForm"
import deleteComment from "app/projects/mutations/deleteComment"
import updateComment from "app/projects/mutations/updateComment"
import Moment from "react-moment"
import createComment from "app/projects/mutations/createComment"
import getProject from "app/projects/queries/getProject"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import CloseIcon from "@material-ui/icons/Close"
import { CommentActions, WrapperDialog, Button as ButtonQuick } from "./Comments.styles"
import ConfirmationModal from "app/core/components/ConfirmationModal"
interface IAuthor {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

interface IComment {
  id: string
  body: string
  author?: IAuthor
  updatedAt: Date
  authorId: string
}

interface IProps {
  projectId?: string
  comments: any
}
const initialComment: IComment = {
  id: "",
  body: "",
  updatedAt: new Date(),
  authorId: "",
}

const Comments = (props: IProps) => {
  const session = useSession()
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openEditComment, setOpenEditComment] = useState<boolean>(false)
  const [commentSelected, setCommentSelected] = useState<IComment>(initialComment)
  const [inputCommentEdit, setInputCommentEdit] = useState<string | null>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [deleteCommentMutation] = useMutation(deleteComment, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
    },
  })

  const [updateCommentMutation] = useMutation(updateComment, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
    },
  })

  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
    },
  })

  const createCommentHandler = async (values) => {
    try {
      const comment = await createCommentMutation({
        projectId: props.projectId!,
        body: values.body,
      })
      values.body = ""
      setAlertMessage("Comment saved successfully!")
      setShowAlert(true)
    } catch (error) {
      console.error(error)
    }
  }

  const editCommentModalHandler = (id: string) => {
    const comment = props.comments && props.comments.find((comment) => comment.id === id)
    if (comment) {
      setInputCommentEdit(comment.body!)
      setCommentSelected(comment)
      setOpenEditComment(true)
    }
  }

  const saveEditCommentHandler = async () => {
    const updatedComment = { ...commentSelected }
    delete updatedComment.author
    updatedComment.body = inputCommentEdit!
    const comment = await updateCommentMutation(updatedComment)
    if (comment) {
      setOpenEditComment(false)
      setAlertMessage("Comment saved successfully!")
      setShowAlert(true)
    }
  }

  const deleteCommentHandle = async () => {
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
        label="Delete"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteCommentHandle()
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
              <CloseIcon fontSize="inherit" />
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
            {props.comments &&
              props.comments.map((item) => {
                return (
                  <div key={item.id}>
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item>
                        <Avatar alt={"alt"} src={item.author?.avatarUrl}></Avatar>
                      </Grid>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <h4>
                          {` ${item.author?.firstName} ${item.author?.lastName} `} .
                          <Typography
                            component="span"
                            style={{
                              marginLeft: 5,
                              fontSize: 13,
                              textAlign: "left",
                              color: "gray",
                            }}
                          >
                            <Moment fromNow>{item.updatedAt}</Moment>
                          </Typography>
                        </h4>
                        <Typography sx={{ fontStyle: "italic", whiteSpace: "pre-line" }}>
                          {" "}
                          {item.body}
                        </Typography>

                        {session.profileId === item.authorId && (
                          <CommentActions>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => {
                                editCommentModalHandler(item.id)
                              }}
                            >
                              <EditIcon />
                            </IconButton>

                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
                                setOpenDeleteModal(true)
                                setCommentSelected(item)
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </CommentActions>
                        )}
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                  </div>
                )
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
              name="body"
              multiline
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
              Cancel
            </Button>
            <ButtonQuick onClick={saveEditCommentHandler}>Save</ButtonQuick>
          </Grid>
        </WrapperDialog>
      </Dialog>
    </Container>
  )
}
export default Comments
