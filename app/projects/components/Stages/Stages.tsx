import { useState } from "react"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { ArrowDownIcon, CardHeaderComponent } from "./Stages.styles"
import TaskItem from "./TaskItem"
import { useProjectMember } from "app/core/hooks/useProjectMember"
import useContributorPath from "app/projects/components/tabs/hooks/useContributorPath"
import SnackbarAlert from "app/core/components/SnackbarAlert"
import Editor from "rich-markdown-editor"

interface IPathItem {
  current?: boolean
  name: string
  criteria: string
  projectTasks: Array<any>
  mission: string
}

interface ICareerPathComponentProps {
  path?: Array<IPathItem>
  viewMode?: boolean
  project?: any
}

const Stages = ({ project, path = [], viewMode = true }: ICareerPathComponentProps) => {
  const { projectTeamMember } = useProjectMember(project)
  const { isLoading, createContributorPathHandler, deleteContributorPathHandler } =
    useContributorPath()
  const [messageAlert, setMessageAlert] = useState<string>("")
  const changeHandle = (projectTaskId: string, contributorPathId: string | null) => {
    if (projectTeamMember.id) {
      if (contributorPathId) {
        deleteContributorPathHandler(contributorPathId)
        setMessageAlert("Task unchecked")
      } else {
        createContributorPathHandler(projectTeamMember.id, projectTaskId)
        setMessageAlert("Task Checked")
      }
    }
  }
  return (
    <>
      {isLoading && <div> Loading... </div>}
      <SnackbarAlert show={!!messageAlert} message={messageAlert} />
      <Typography variant="h5" sx={{ marginTop: "30px", marginBottom: "30px" }}>
        {`There are ${path.length} stages in your contributor path`}
      </Typography>
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {path.map((pathItem, index) => {
          const { projectTasks } = pathItem
          const projectTaskIds = projectTasks.map((projectTask) => projectTask.id)
          const finishSomeTask =
            projectTeamMember?.contributorPath &&
            projectTeamMember.contributorPath.some((CP: any) =>
              projectTaskIds.includes(CP.projectTaskId)
            )

          return (
            <Card
              key={index}
              sx={{
                flexGrow: 1,
                flexDirection: "column",
                alignItems: "center",
                display: "flex",
                marginLeft: "10px",
                marginRight: "10px",
                width: "300px",
                fontFamily: "Poppins",
              }}
              elevation={3}
            >
              <CardHeaderComponent current={finishSomeTask}>
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  {pathItem.name}
                </Typography>
              </CardHeaderComponent>
              <ArrowDownIcon current={finishSomeTask} />
              <div
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  flexGrow: 1,
                  justifyContent: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <b>Criteria:</b>
                <Editor
                  readOnly={true}
                  defaultValue={pathItem.criteria ? pathItem.criteria : ""}
                ></Editor>

                <b>Tasks:</b>
                {pathItem.projectTasks.map((taskItem, index) => {
                  const contributorPath =
                    projectTeamMember?.contributorPath &&
                    projectTeamMember.contributorPath.find(
                      (contributorPath) =>
                        contributorPath.projectTaskId === taskItem.id &&
                        contributorPath.projectMemberId === projectTeamMember.id
                    )
                  return (
                    <TaskItem
                      key={index}
                      completed={!!contributorPath}
                      contributorPath={contributorPath}
                      editable={projectTeamMember?.active}
                      taskItemId={taskItem.id}
                      changeHandle={changeHandle}
                      {...taskItem}
                    />
                  )
                })}
                <b>Mission:</b>
                <Editor
                  readOnly={true}
                  defaultValue={pathItem.mission ? pathItem.mission : ""}
                ></Editor>
              </div>
            </Card>
          )
        })}
      </Box>
    </>
  )
}

export default Stages
