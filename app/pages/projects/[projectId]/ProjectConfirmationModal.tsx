import { useState } from "react"

import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

import ConfirmationModal from "app/core/components/ConfirmationModal"

interface IProps {
  close: () => void
  handleClose: () => void
  member: any
  label: string
  onClick: () => {}
  open: boolean
  project: any
}

const ProjectConfirmationModal = ({
  close,
  handleClose,
  member,
  label,
  onClick,
  open,
  project,
}: IProps) => {
  const [disableBtn, setDisableBtn] = useState(member.profileId === project.ownerId)
  const [owner, setOwner] = useState("")

  const handleChange = (e) => {
    setOwner(e.target.value)
    setDisableBtn(false)
  }

  const RenderModalContent = () => {
    if (member.profileId === project.ownerId) {
      // In case it is the owner do one who is leaving...
      return (
        <>
          <h1>Before you leave...</h1>
          <p>
            Currently you are the Owner of this project. Please, assign a new owner before leaving
            the project.
          </p>
          <div style={{ padding: "20px 20px 0px 20px" }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Members"
              onChange={(e) => handleChange(e)}
              style={{ width: "100%" }}
              value={owner}
            >
              {project.projectMembers.map((member, index) => {
                if (member.profileId !== project.ownerId) {
                  return (
                    <MenuItem key={`member-${index}`} value={member.profileId}>
                      {member.profile.firstName} {member.profile.lastName} ({member.profile.email})
                    </MenuItem>
                  )
                }
              })}
            </Select>
          </div>
        </>
      )
    } else if (member.active) {
      // In case any NO OWNER member leaves...
      return (
        <>
          <h1>We're sorry you're leaving the project</h1>
          <p>
            By confirming you will be inactive for this project but you can join again at anytime.
          </p>
        </>
      )
    } else {
      return (
        <>
          <h1>Welcome back!</h1>
          <p>Do you want to contribute again?</p>
        </>
      )
    }
  }

  return (
    <ConfirmationModal
      close={close}
      disabled={disableBtn}
      handleClose={handleClose}
      label={label}
      onClick={onClick}
      open={open}
    >
      <RenderModalContent />
    </ConfirmationModal>
  )
}

export default ProjectConfirmationModal
