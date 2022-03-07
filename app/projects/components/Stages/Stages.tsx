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
  id: string
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
  const changeHandle = (
    projectTaskId: string,
    contributorPathId: string | null,
    projectStageId: string
  ) => {
    if (projectTeamMember.id) {
      if (contributorPathId) {
        deleteContributorPathHandler(contributorPathId)
        setMessageAlert("Task unchecked")
      } else {
        createContributorPathHandler(projectTeamMember.id, projectTaskId, projectStageId)
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
          gap: "15px",
          flexDirection: "row",
          marginTop: "10px",
          marginBottom: "10px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollSnapType: "x mandatory",
        }}
      >
        {path.map((pathItem, index) => {
          const { projectTasks, id: projectStageId } = pathItem
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
                width: 180,
                fontFamily: "Poppins",
                flex: "10 0 auto",
                "@media (max-width: 600px)": {
                  width: "70%",
                  scrollSnapAlign: "center",
                },
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
                {pathItem.projectTasks.map((taskItem) => {
                  const contributorPath =
                    projectTeamMember?.contributorPath &&
                    projectTeamMember.contributorPath.find(
                      (contributorPath) =>
                        contributorPath.projectTaskId === taskItem.id &&
                        contributorPath.projectMemberId === projectTeamMember.id
                    )
                  return (
                    <TaskItem
                      key={taskItem.id}
                      completed={!!contributorPath}
                      contributorPath={contributorPath}
                      editable={projectTeamMember?.active}
                      taskItemId={taskItem.id}
                      projectStageId={projectStageId}
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
