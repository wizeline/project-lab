import { Suspense, useRef } from "react"
import { Link, useQuery, useParam, BlitzPage, useMutation, Routes, invalidateQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import upvoteProject from "app/projects/mutations/upvoteProject"
import Header from "app/core/layouts/Header"
import {
  Card,
  CardContent,
  Container,
  Chip,
  Stack,
  Grid,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItem,
  List,
} from "@material-ui/core"
import { HeaderInfo, DetailMoreHead } from "./[projectId].styles"
import { CommentForm } from "app/projects/components/CommentForm"
import createComment from "app/projects/mutations/createComment"

export const Project = () => {
  const projectId = useParam("projectId", "string")
  const commentsRef = useRef<any>(null)
  const [project, { refetch }] = useQuery(getProject, { id: projectId })
  const [upvoteProjectMutation] = useMutation(upvoteProject)
  const [createCommentMutation] = useMutation(createComment, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
      commentsRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "start" })
    },
  })
  const handleVote = async (id: string) => {
    try {
      await upvoteProjectMutation({ id })
      refetch()
    } catch (error) {
      alert("Error updating votes " + JSON.stringify(error, null, 2))
    }
  }
  const createCommentHandler = async (values) => {
    try {
      const comment = await createCommentMutation({
        projectId: project.id,
        body: values.body,
      })
      values.body = ""
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Header title={project.name} />

      <div className="wrapper">
        <HeaderInfo>
          <div className="headerInfo--action">
            <button className="primary" onClick={() => handleVote(project.id)}>
              UPVOTE {project.votesCount}
            </button>
            <div className="headerInfo--edit">
              <Link href={Routes.EditProjectPage({ projectId: project.id })} passHref>
                <img src="/edit.svg" alt="" />
              </Link>
            </div>
          </div>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} className="">
              <div className="titleProposal">
                <h1>{project.name}</h1>
              </div>
              <div className="descriptionProposal">{project.description}</div>
            </Grid>
          </Grid>
        </HeaderInfo>
      </div>
      <div className="wrapper">
        <DetailMoreHead>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <div className="itemHeadName">Status:</div>{" "}
              <div className="itemHeadValue">{project.status}</div>
            </Grid>
            <Grid item xs={4}>
              <div className="itemHeadName">Category:</div>{" "}
              <div className="itemHeadValue">{project.categoryName}</div>
            </Grid>
            <Grid item container xs={4} spacing={1} alignItems="center">
              <Grid item>
                <div className="itemHeadName">Labels:</div>
              </Grid>
              <Grid item>
                {project.labels.map((item, index) => (
                  <div className="itemHeadValue" key={index}>
                    {item.name}
                  </div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DetailMoreHead>
      </div>
      <div className="wrapper">
        <Container style={{ padding: "0px" }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={8}>
              <Card variant="outlined">
                <CardContent>
                  <h2>Description</h2>
                  <div>{project.valueStatement}</div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="column" spacing={1}>
                <Card variant="outlined">
                  <CardContent>
                    <big>Skills:</big>
                    <Stack direction="row" spacing={1}>
                      {project.skills.map((item, index) => (
                        <Chip key={index} label={item.name} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <big>Members:</big>
                    <Stack direction="column">
                      {project.projectMembers.map((item, index) => (
                        <div key={index}>
                          <Typography
                            component={"div"}
                            color={item.active ? "text.primary" : "text.secondary"}
                          >
                            <div>
                              {item.profile?.firstName} {item.profile?.lastName}
                              {item.hoursPerWeek
                                ? " - " + item.hoursPerWeek + " Hours per week"
                                : null}
                            </div>
                            <div>
                              <small>{item.role}</small>
                            </div>
                          </Typography>
                        </div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className="wrapper" ref={commentsRef}>
        <Container>
          <big>Comments</big>
          <Grid>
            <Grid>
              <CommentForm
                submitText="Add Comment"
                onSubmit={(values) => createCommentHandler(values)}
              />

              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {project.comments.map((item, index) => {
                  return (
                    <Container key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={item.author.firstName} src={item.author.avatarUrl ?? ""} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.updatedAt.toDateString()}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {`${item.author.firstName} ${item.author.lastName}`}
                              </Typography>
                              {` — ${item.body}`}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Container>
                  )
                })}
              </List>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  )
}

const ShowProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Project />
      </Suspense>
    </div>
  )
}

ShowProjectPage.authenticate = true
ShowProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowProjectPage
