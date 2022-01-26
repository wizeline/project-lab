import React from "react"
import { useRouter } from "blitz"
import { Box, Button } from "@mui/material"
import Typography from "@mui/material/Typography"

interface IProps {
  projectId: any
}

const JoinSuccess = (props: IProps) => {
  const router = useRouter()
  const goBack = () => router.back()

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
        <Button className="primary" onClick={goBack} variant="contained">
          Continue
        </Button>
      </Box>
    </Box>
  )
}

export default JoinSuccess
