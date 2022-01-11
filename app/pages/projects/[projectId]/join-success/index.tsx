import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CareerPathComponent from "app/projects/components/joinProjectSucess/careerPathComponent"
import { OrangeColoredButton } from "../[projectId].styles"

const path = [
  {
    current: true,
    title: "placeholder",
    criteria: "placeholder criteria",
    criteriaDescription: "criteria description",
    tasks: "placeholder tasks",
    taskItems: ["item 1"],
    mission: "Placeholder mission",
    missionDescription: "mission description",
  },
  {
    current: false,
    title: "placeholder",
    criteria: "placeholder criteria",
    criteriaDescription: "criteria description",
    tasks: "placeholder tasks",
    taskItems: ["item 1"],
    mission: "Placeholder mission",
    missionDescription: "mission description",
  },
  {
    current: false,
    title: "placeholder",
    criteria: "placeholder criteria",
    criteriaDescription: "criteria description",
    tasks: "placeholder tasks",
    taskItems: ["item 1"],
    mission: "Placeholder mission",
    missionDescription: "mission description",
  },
  {
    current: false,
    title: "placeholder",
    criteria: "placeholder criteria",
    criteriaDescription: "criteria description",
    tasks: "placeholder tasks",
    taskItems: ["item 1"],
    mission: "Placeholder mission",
    missionDescription: "mission description",
  },
  {
    current: false,
    title: "placeholder",
    criteria: "placeholder criteria",
    criteriaDescription: "criteria description",
    tasks: "placeholder tasks",
    taskItems: ["item 1"],
    mission: "Placeholder mission",
    missionDescription: "mission description",
  },
]

function JoinSuccess() {
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
          variant="h6"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          You have successfully joined Wize Runner
        </Typography>
        <CareerPathComponent path={path} />
        <OrangeColoredButton variant="contained">Continue</OrangeColoredButton>
      </Box>
    </Box>
  )
}

export default JoinSuccess
