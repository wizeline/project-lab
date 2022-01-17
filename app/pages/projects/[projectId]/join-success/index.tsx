import React from "react"
import { Routes, useRouter } from "blitz"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CareerPathComponent from "app/projects/components/joinProjectSucess/careerPathComponent"
import { OrangeColoredButton } from "../[projectId].styles"

const path = [
  {
    current: true,
    title: "Stage Name 1",
    criteriaDescription: "criteria description 1",
    taskItems: [
      {
        editable: true,
        title: "Task 1",
        description: "Description for task 1",
        completed: true,
      },
      {
        editable: true,
        title: "Task 2",
        description: "Description for task 2",
        completed: true,
      },
      {
        editable: true,
        title: "Task 3",
        description: "Description for task 3",
        completed: false,
      },
    ],
    missionDescription: "mission description 1",
  },
  {
    current: false,
    title: "Stage Name 2",
    criteriaDescription: "criteria description 2",
    taskItems: [
      {
        editable: true,
        title: "Task 1",
        description: "Description for task 1",
        completed: true,
      },
      {
        editable: true,
        title: "Task 2",
        description: "Description for task 2",
        completed: true,
      },
      {
        editable: true,
        title: "Task 3",
        description: "Description for task 3",
        completed: false,
      },
    ],
    missionDescription: "mission description 2",
  },
  {
    current: false,
    title: "Stage Name 3",
    criteriaDescription: "criteria description 3",
    taskItems: [
      {
        editable: true,
        title: "Task 1",
        description: "Description for task 1",
        completed: true,
      },
      {
        editable: true,
        title: "Task 2",
        description: "Description for task 2",
        completed: true,
      },
      {
        editable: true,
        title: "Task 3",
        description: "Description for task 3",
        completed: false,
      },
    ],
    missionDescription: "mission description 3",
  },
  {
    current: false,
    title: "Stage Name 4",
    criteriaDescription: "criteria description 4",
    taskItems: [
      {
        editable: true,
        title: "Task 1",
        description: "Description for task 1",
        completed: true,
      },
      {
        editable: true,
        title: "Task 2",
        description: "Description for task 2",
        completed: true,
      },
      {
        editable: true,
        title: "Task 3",
        description: "Description for task 3",
        completed: false,
      },
    ],
    missionDescription: "mission description 4",
  },
  {
    current: false,
    title: "Stage Name 5",
    criteriaDescription: "criteria description 5",
    taskItems: [
      {
        editable: true,
        title: "Task 1",
        description: "Description for task 1",
        completed: true,
      },
      {
        editable: true,
        title: "Task 2",
        description: "Description for task 2",
        completed: true,
      },
      {
        editable: true,
        title: "Task 3",
        description: "Description for task 3",
        completed: false,
      },
    ],
    missionDescription: "mission description 5",
  },
]

interface IProps {
  projectId: any
}

function JoinSuccess(props) {
  const router = useRouter()
  const goBack = () => router.back()
  console.log("a", props)
  console.log(props.projectId)

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "80%",
          width: "70%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Congratulations!
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          You have successfully joined the project
        </Typography>
        <CareerPathComponent path={path} viewMode={false} />
        <OrangeColoredButton onClick={goBack} variant="contained">
          Continue
        </OrangeColoredButton>
      </Box>
    </Box>
  )
}

export default JoinSuccess
