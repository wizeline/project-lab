import React from "react"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { ArrowDownIcon, CardHeaderComponent } from "./joinProjectSuccess.styles"

interface IPathItem {
  current: boolean
  title: string
  criteria: string
  criteriaDescription: string
  tasks: string
  taskItems: Array<string>
  mission: string
  missionDescription: string
}

interface ICareerPathComponentProps {
  path?: Array<IPathItem>
}

function CareerPathComponent({ path = [] }: ICareerPathComponentProps) {
  return (
    <>
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
        {path.map((pathItem, index) => (
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
            }}
            elevation={3}
          >
            <CardHeaderComponent current={pathItem.current}>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                }}
              >
                {pathItem.title}
              </Typography>
            </CardHeaderComponent>
            <ArrowDownIcon current={pathItem.current} />
            <div
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                flexGrow: 1,
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <b style={{ marginTop: "20px" }}>{pathItem.criteria}</b>
              <p>{pathItem.criteriaDescription}</p>

              <b style={{ marginTop: "10px" }}>{pathItem.tasks}</b>
              {pathItem.taskItems.map((taskItem, index) => (
                <p key={index}>{taskItem}</p>
              ))}

              <b style={{ marginTop: "10px" }}>{pathItem.mission}</b>
              <p>{pathItem.missionDescription}</p>
            </div>
          </Card>
        ))}
      </Box>
      <Typography variant="h5" sx={{ marginTop: "30px", marginBottom: "30px" }}>
        {`There are ${path.length} stages in your contributor path`}
      </Typography>
    </>
  )
}

export default CareerPathComponent
