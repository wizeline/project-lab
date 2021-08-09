import { Suspense } from "react"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import upvoteProject from "app/projects/mutations/upvoteProject"
import Header from "app/core/layouts/Header"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Container from "@material-ui/core/Container"
import Chip from "@material-ui/core/Chip"
import Stack from "@material-ui/core/Stack"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"

export const Project = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "string")
  const [project, { refetch }] = useQuery(getProject, { id: projectId })
  const [upvoteProjectMutation] = useMutation(upvoteProject)

  const handleVote = async (id: string) => {
    try {
      await upvoteProjectMutation({ id })
      refetch()
    } catch (error) {
      alert("Error updating votes " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <>
      <Header title={project.name} />

      <div className="wrapper">
        <Grid container justifyContent="space-between">
          <Grid item>
            <h1>{project.name}</h1>
            <small>
              <Link href={Routes.EditProjectPage({ projectId: project.id })} passHref>
                <a>Edit</a>
              </Link>
            </small>
          </Grid>
          <Grid item>
            <button className="primary" onClick={() => handleVote(project.id)}>
              UPVOTE {project.votesCount}
            </button>
          </Grid>
        </Grid>
        <div>{project.description}</div>
      </div>
      <div className="wrapper">
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <big>Status:</big> {project.status}
          </Grid>
          <Grid item xs={4}>
            <big>Category:</big> {project.categoryName}
          </Grid>
          <Grid item container xs={4} spacing={1} alignItems="center">
            <Grid item>
              <big>Labels:</big>
            </Grid>
            <Grid item>
              {project.labels.map((item, index) => (
                <div key={index}>{item.name}</div>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Container>
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
                        <Typography color={item.active ? "text.primary" : "text.secondary"}>
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
