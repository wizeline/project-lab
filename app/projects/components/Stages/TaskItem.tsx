import React from "react"
import styled from "@emotion/styled"
import Checkbox from "@mui/material/Checkbox"
import Editor from "rich-markdown-editor"
import { useSession } from "blitz"

const HorizontalDiv = styled.div`
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid gray;
`

interface ITaskItemProps {
  editable?: boolean
  description?: string
  completed?: boolean
  changeHandle: any
  taskItemId: any
  projectStageId: any
  contributorPath?: any
}

const TaskItem = ({
  editable,
  description,
  completed,
  changeHandle,
  taskItemId,
  projectStageId,
  contributorPath,
}: ITaskItemProps) => {
  const session = useSession()
  const contributorPathId = contributorPath?.id || null

  return (
    <HorizontalDiv>
      <Checkbox
        onChange={() => {
          changeHandle(taskItemId, contributorPathId, projectStageId)
        }}
        checked={completed}
        disabled={!editable}
      />
      <Editor readOnly={true} defaultValue={description ? description : ""}></Editor>
    </HorizontalDiv>
  )
}

export default TaskItem
