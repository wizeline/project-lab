import React from "react"
import styled from "@emotion/styled"
import Checkbox from "@mui/material/Checkbox"
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
  contributorPath?: any
}

const TaskItem = ({
  editable,
  description,
  completed,
  changeHandle,
  taskItemId,
  contributorPath,
}: ITaskItemProps) => {
  const session = useSession()
  const contributorPathId = contributorPath?.id || null

  return (
    <HorizontalDiv>
      {editable && (
        <Checkbox
          onChange={() => {
            changeHandle(taskItemId, contributorPathId)
          }}
          checked={completed}
          disabled={!editable}
        />
      )}
      <p>{description}</p>
    </HorizontalDiv>
  )
}

export default TaskItem
