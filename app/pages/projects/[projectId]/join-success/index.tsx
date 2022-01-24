import React from "react"
import { useRouter } from "blitz"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { OrangeColoredButton } from "../[projectId].styles"

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
          Welcome!
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
        <OrangeColoredButton onClick={goBack} variant="contained">
          Continue
        </OrangeColoredButton>
      </Box>
    </Box>
  )
}

export default JoinSuccess
