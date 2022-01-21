import React from "react"
import { Grid, Avatar } from "@mui/material"
import PositionedMenu from "app/core/components/PositionedMenu"
import Moment from "react-moment"
import { useSession } from "blitz"
import { CommentBody, CommentTime } from "./Comments.styles"
import ReplyComment from "./ReplyComment"
import { IComment } from "./CommentInterfaces"

interface IProps {
  projectId: string
  comment: IComment
  editCommentModalHandler: any
  setOpenDeleteModal: any
  setCommentSelected: any
}

const CommentItem = (props: IProps) => {
  const session = useSession()
  const { projectId, comment, editCommentModalHandler, setOpenDeleteModal, setCommentSelected } =
    props

  const menuItems = [
    {
      callback: () => {
        editCommentModalHandler(comment.id)
      },
      text: "Edit",
    },
    {
      callback: () => {
        setOpenDeleteModal(true)
        setCommentSelected(comment)
      },
      text: "Delete",
    },
  ]

  return (
    <>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar alt={"alt"} src={comment.author?.avatarUrl ?? ""}></Avatar>
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <h4>
            {` ${comment.author?.firstName} ${comment.author?.lastName} `}
            <CommentTime>
              {" "}
              - <Moment fromNow>{comment.updatedAt}</Moment>{" "}
            </CommentTime>
          </h4>
          <CommentBody>
            {comment.body}
            {session.profileId === comment.authorId && <PositionedMenu menuItems={menuItems} />}
          </CommentBody>
          {comment.children &&
            comment.children.map((commentChild) => {
              return (
                <CommentItem
                  key={commentChild.id}
                  comment={commentChild}
                  projectId={projectId}
                  setOpenDeleteModal={setOpenDeleteModal}
                  setCommentSelected={setCommentSelected}
                  editCommentModalHandler={editCommentModalHandler}
                />
              )
            })}
          {!comment.parentId && <ReplyComment projectId={projectId} parentId={comment.id} />}
        </Grid>
      </Grid>
    </>
  )
}
export default CommentItem
