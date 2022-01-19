import { Suspense, useState } from "react"
import Editor from "rich-markdown-editor"
import { Link, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import {
  Card,
  CardContent,
  Container,
  Chip,
  Stack,
  Grid,
  Typography,
  Box,
  TextField,
} from "@mui/material"

import { useSessionUserIsProjectTeamMember } from "app/core/hooks/useSessionUserIsProjectTeamMember"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import upvoteProject from "app/projects/mutations/upvoteProject"
import Header from "app/core/layouts/Header"
import Loader from "app/core/components/Loader"
import Comments from "app/projects/components/tabs/Comments"
import JoinProjectModal from "app/projects/components/joinProjectModal"
import ContributorPathReport from "app/projects/components/ContributorPathReport"
import { HeaderInfo, DetailMoreHead, OrangeColoredButton } from "./[projectId].styles"

export const Project = () => {
  const projectId = useParam("projectId", "string")
  const [project, { refetch }] = useQuery(getProject, { id: projectId })
  const [upvoteProjectMutation] = useMutation(upvoteProject)
  const isTeamMember = useSessionUserIsProjectTeamMember(project)
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)

  const handleVote = async (id: string) => {
    try {
      const haveIVoted = project.votes.length > 0 ? true : false
      await upvoteProjectMutation({ id, haveIVoted })
      refetch()
    } catch (error) {
      alert("Error updating votes " + JSON.stringify(error, null, 2))
    }
  }

  function handleJoinProject() {
    setShowJoinModal(true)
  }

  function handleCloseModal() {
    setShowJoinModal(false)
  }

  return (
    <>
      <Header title={project.name} />
      <div className="wrapper">
        <HeaderInfo>
          <div className="headerInfo--action">
            <button
              className={project.votes.length > 0 ? "primary unlike" : "primary like"}
              onClick={() => handleVote(project.id)}
            >
              {project.votes.length > 0 ? "Unlike" : "Like"}
            </button>
            <div className="like-bubble">{project.votesCount}</div>
            <div className="headerInfo--edit">
              {isTeamMember && (
                <Link href={Routes.EditProjectPage({ projectId: project.id })} passHref>
                  <img src="/edit.svg" alt="" />
                </Link>
              )}
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
                  <div>
                    <Editor
                      readOnly={true}
                      defaultValue={project.valueStatement ? project.valueStatement : ""}
                    ></Editor>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="column" spacing={1}>
                <Card variant="outlined">
                  <CardContent>
                    <big>Slack Channel:</big>
                    <Stack direction="row" spacing={1}>
                      {project.slackChannel}
                    </Stack>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <big>Repo URL:</big>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="foo"
                        defaultValue={project.repoUrl}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          width: "100%",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
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
                <Card>
                  <CardContent>
                    <big>Help Wanted:</big>
                    <Stack direction="column">
                      <div>
                        <Typography component={"div"} color="text.primary">
                          <div>React Js</div>
                          <div>
                            <small>(Any level)</small>
                          </div>
                        </Typography>
                      </div>
                    </Stack>
                  </CardContent>
                </Card>
                {!isTeamMember && (
                  <OrangeColoredButton onClick={handleJoinProject} variant="contained">
                    Join Project
                  </OrangeColoredButton>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className="wrapper">
        <ContributorPathReport project={project} />
      </div>
      <div className="wrapper">
        <Comments projectId={projectId!} />
      </div>
      <JoinProjectModal
        projectId={projectId!}
        open={showJoinModal}
        handleCloseModal={handleCloseModal}
      />
    </>
  )
}

const ShowProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Project />
      </Suspense>
    </div>
  )
}

ShowProjectPage.authenticate = true
ShowProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowProjectPage
