import React from "react"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { ArrowDownIcon, CardHeaderComponent } from "./joinProjectSuccess.styles"
import styled from "@emotion/styled";
import Checkbox from "@mui/material/Checkbox";

interface IPathItem {
  current: boolean
  title: string
  criteriaDescription: string
  taskItems: Array<any>
  missionDescription: string
}

interface ICareerPathComponentProps {
  path?: Array<IPathItem>;
  viewMode?: boolean;
}

const HorizontalDiv = styled.div`
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

interface ITaskItemProps {
  editable?: boolean;
  title?: string;
  description?: string;
  completed?: boolean;
}

function TaskItem({ editable, title, description, completed}: ITaskItemProps) {
  return (
    <HorizontalDiv>
      {editable && (
        <Checkbox checked={completed} disabled={!editable}  />
      )}
      <p>
        {title}
      </p>
    </HorizontalDiv>
  )
}

function CareerPathComponent({ path = [], viewMode = true }: ICareerPathComponentProps) {
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
                paddingLeft: "5px",
                paddingRight: "5px",
                flexGrow: 1,
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <b>Criteria:</b>
              <p>{pathItem.criteriaDescription}</p>

              <b>Tasks:</b>
              {pathItem.taskItems.map((taskItem, index) => (
                <TaskItem editable={viewMode} {...taskItem} key={index} />
              ))}

              <b>Mission:</b>
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
