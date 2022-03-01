import React from "react"

import IconButton from "@mui/material/IconButton"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

import { CollapsableHeader } from "./ProjectContributorsPathForm.styles"

interface IProps {
  openedStage: number
  position: number
  setOpenedStage(arg1): void
}

function StageCollapsableHeader({ openedStage, position, setOpenedStage }: IProps) {
  return (
    <CollapsableHeader onClick={() => setOpenedStage(position === openedStage ? 0 : position)}>
      <h2>Stage {position}</h2>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpenedStage(position === openedStage ? 0 : position)}
      >
        {position === openedStage ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </CollapsableHeader>
  )
}

export default StageCollapsableHeader
