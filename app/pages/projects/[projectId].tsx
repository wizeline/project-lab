import { Suspense } from "react"
import styled from "@emotion/styled"
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
      </div>
    </>
  )
}

const HeaderInfo = styled.div`
  position: relative;
  .headerInfo--action {
    position: absolute;
    right: 13px;
  }
  .headerInfo--edit {
    padding-left: 15px;
    padding-right: 5px;
    display: inline-block;
  }
  .headerInfo--edit img {
    cursor: pointer;
    width: 25px;
    line-height: 44px;
    height: 44px;
    vertical-align: middle;
  }
  .titleProposal {
    text-align: center;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 37px;
  }
  .titleProposal h1 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
  }
  .descriptionProposal {
    color: #475f7b;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 15px;
  }
`

const DetailMoreHead = styled.div`
  .itemHeadName {
    color: #475f7b;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    display: inline-block;
  }
  .itemHeadValue {
    color: #4a627d;
    font-family: Poppins;
    font-size: 15px;
    letter-spacing: 0;
    line-height: 21px;
    display: inline-block;
  }
`

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
