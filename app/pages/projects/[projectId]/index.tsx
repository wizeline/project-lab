import { Suspense, useState } from "react"
import Editor from "rich-markdown-editor"
import {
  Link,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  invalidateQuery,
  Routes,
  useSession,
} from "blitz"
import { Card, CardContent, Chip, Stack, Grid, Box, TextField, Button } from "@mui/material"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useSessionUserIsProjectTeamMember } from "app/core/hooks/useSessionUserIsProjectTeamMember"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import getProjectMember from "app/projects/queries/getProjectMember"
import upvoteProject from "app/projects/mutations/upvoteProject"
import Header from "app/core/layouts/Header"
import Loader from "app/core/components/Loader"
import Comments from "app/projects/components/tabs/Comments"
import JoinProjectModal from "app/projects/components/joinProjectModal"
import ContributorPathReport from "app/projects/components/ContributorPathReport"
import ProjectConfirmationModal from "./ProjectConfirmationModal"
import { HeaderInfo, DetailMoreHead, Like, LikeBox, EditButton } from "./[projectId].styles"
import Stages from "app/projects/components/Stages"
import { EditSharp, ThumbUpSharp, ThumbDownSharp } from "@mui/icons-material"
import updateProjectMember from "app/projects/mutations/updateProjectMember"
import updateProjectOwner from "app/projects/mutations/updateProjectOwner"
import { adminRoleName } from "app/core/utils/constants"
import { formatDistance } from "date-fns"

export const Project = () => {
  const projectId = useParam("projectId", "string")
  const [project, { refetch }] = useQuery(getProject, { id: projectId })
  const [member] = useQuery(getProjectMember, { id: projectId })
  const [upvoteProjectMutation] = useMutation(upvoteProject)
  const isTeamMember = useSessionUserIsProjectTeamMember(project)
  const user = useCurrentUser()
  const session = useSession()
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [joinProjectButton, setJoinProjectButton] = useState<boolean>(false)
  const [savingVoteStatus, setSavingVoteStatus] = useState<boolean>(false)
  const handleVote = async (id: string) => {
    setSavingVoteStatus(true)
    try {
      const haveIVoted =
        project.votes.filter((vote) => {
          return vote.profileId === session.profileId
        }).length > 0

      await upvoteProjectMutation({ id, haveIVoted })
      await refetch()
      setSavingVoteStatus(false)
    } catch (error) {
      setSavingVoteStatus(false)
      alert("Error updating votes " + JSON.stringify(error, null, 2))
    }
  }

  const handleJoinProject = () => {
    setShowJoinModal(true)
  }

  const handleCloseModal = () => {
    setShowJoinModal(false)
  }

  const [updateProjectMemberMutation] = useMutation(updateProjectMember, {
    onSuccess: async () => {
      await invalidateQuery(getProjectMember)
      refetch()
      setJoinProjectButton(false)
    },
  })

  const [updateProjectOwnerMutation] = useMutation(updateProjectOwner, {
    onSuccess: async () => {
      await invalidateQuery(getProject)
      refetch()
    },
  })

  const updateProjectMemberHandle = async (active, newOwner) => {
    setShowModal(false)
    setJoinProjectButton(true)

    //If it is the case the owner is leaving...
    if (member?.profileId === project.ownerId)
      await updateProjectOwnerMutation({ data: project, newOwner: newOwner, projectId: project.id })

    await updateProjectMemberMutation({ id: member?.id, active })
  }

  return (
    <>
      <Header title={project.name} />
      <div className="wrapper">
        <HeaderInfo>
          <div className="headerInfo--action">
            <div className="headerInfo--edit">
              {(isTeamMember || user?.role === adminRoleName) && (
                <Link href={Routes.EditProjectPage({ projectId: project.id })} passHref>
                  <EditButton>
                    <EditSharp />
                  </EditButton>
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
              <div className="lastUpdateProposal">
                Last update: {formatDistance(project.updatedAt, new Date(), { addSuffix: true })}
              </div>
            </Grid>
          </Grid>
        </HeaderInfo>
      </div>
      <div className="wrapper">
        <DetailMoreHead>
          <Grid container alignItems="flex-start" justifyContent="flex-start">
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Owner:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{`${project.owner?.firstName} ${project.owner?.lastName}`}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Status:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{project.status}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Tier:</div>{" "}
              </Grid>
              <Grid item>
                <div className="itemHeadValue">{project.tierName}</div>
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Labels:</div>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1}>
                  {project.labels.map((item, index) => (
                    <Chip key={index} label={item.name} />
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Grid
              item
              container
              sm={6}
              xs={12}
              spacing={1}
              alignItems="center"
              justifyContent="flex-start"
              direction={{ xs: "column", md: "row" }}
            >
              <Grid item>
                <div className="itemHeadName">Innovation Tier:</div>
              </Grid>
              <Grid item>
                <a
                  href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="itemHeadValue innovationTier">{project.tierName}</div>
                </a>
              </Grid>
            </Grid>
          </Grid>
        </DetailMoreHead>
      </div>
      {isTeamMember && (
        <div className="wrapper">
          <Stages path={project.stages} project={project} />
        </div>
      )}
      <div className="wrapper">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <LikeBox>
                  <Like>
                    <div className="like-bubble">
                      <span>{project.votes.length}</span>
                    </div>
                    <Button
                      className="primary"
                      disabled={savingVoteStatus}
                      onClick={() => handleVote(project.id)}
                    >
                      {project.votes.filter((vote) => {
                        return vote.profileId === session.profileId
                      }).length > 0 ? (
                        <>
                          {"Unlike"}&nbsp;
                          <ThumbDownSharp />
                        </>
                      ) : (
                        <>
                          {"Like"}&nbsp;
                          <ThumbUpSharp />
                        </>
                      )}
                    </Button>
                  </Like>
                </LikeBox>
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
          <Grid item xs={12} md={4}>
            <Stack direction="column" spacing={1}>
              {project.slackChannel && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Slack Channel:</big>
                    <Stack direction="row" spacing={1}>
                      {project.slackChannel}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {project.repoUrls && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Repos URLs:</big>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      {project.repoUrls.map((item, index) => (
                        <Stack spacing={2} key={index}>
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.url}
                          </a>
                        </Stack>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
              {project.skills.length > 0 && (
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
              )}
              {project.disciplines.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <big>Looking for:</big>
                    <Stack direction="row" spacing={1}>
                      {project.disciplines.map((item, index) => (
                        <Chip key={index} label={item.name} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {isTeamMember ? (
                <Button
                  className="primary large"
                  disabled={joinProjectButton}
                  onClick={() => setShowModal(true)}
                >
                  {member?.active ? "Suspend my Membership" : "Join Project Again"}
                </Button>
              ) : (
                project.helpWanted && (
                  <Button className="primary large" onClick={handleJoinProject}>
                    Want to Join?
                  </Button>
                )
              )}
            </Stack>
          </Grid>
        </Grid>
      </div>
      <div className="wrapper">
        <Grid>
          <big>Related Projects</big>
          <Box>
            {project.relatedProjects.map((item, i) => {
              return (
                <Link key={i} href={Routes.ShowProjectPage({ projectId: item.id })}>
                  <Chip sx={{ margin: "1em .5em" }} label={item.name}></Chip>
                </Link>
              )
            })}
          </Box>
        </Grid>
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
      {member && (
        <ProjectConfirmationModal
          close={() => setShowModal(false)}
          handleClose={() => setShowModal(false)}
          label={"confirm"}
          member={member}
          onClick={updateProjectMemberHandle}
          open={showModal}
          project={project}
        />
      )}
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
