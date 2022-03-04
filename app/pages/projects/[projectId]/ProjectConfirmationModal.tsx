import { useState } from "react"

import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

import ConfirmationModal from "app/core/components/ConfirmationModal"

interface IProps {
  close: () => void
  handleClose: () => void
  member: any
  label: string
  onClick: (active: any, test: any) => Promise<void>
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
  const [newOwner, setnewOwner] = useState("")

  const handleChange = (e) => {
    setnewOwner(e.target.value)
    setDisableBtn(false)
  }

  const RenderModalContent = () => {
    let title: string
    let content: string

    if (member.profileId === project.ownerId) {
      // In case it is the owner the one who is leaving...
      return (
        <>
          <h1>Before you leave...</h1>
          <p>
            Currently you are the Owner of this project. Please, assign a new owner before leaving
            the project.
          </p>
          <div style={{ padding: "20px 20px 0px 20px" }}>
            <FormControl fullWidth>
              <InputLabel id="members-label">Members</InputLabel>
              <Select
                label="Members"
                labelId="members-label"
                onChange={(e) => handleChange(e)}
                style={{ width: "100%" }}
                value={newOwner}
              >
                {project.projectMembers.map((member, index) => {
                  if (member.profileId !== project.ownerId && member.active === true) {
                    return (
                      <MenuItem key={`member-${index}`} value={member}>
                        {member.profile.firstName} {member.profile.lastName} ({member.profile.email}
                        )
                      </MenuItem>
                    )
                  }
                })}
              </Select>
            </FormControl>
          </div>
        </>
      )
    } else if (member.active) {
      // In case any NO OWNER member leaves...
      title = "We're sorry you're leaving the projec"
      content =
        "By confirming you will be inactive for this project but you can join again at anytime."
    } else {
      title = "Welcome back!"
      content = "Do you want to contribute again?"
    }

    return (
      <>
        <h1>{title}</h1>
        <p>{content}</p>
      </>
    )
  }

  return (
    <ConfirmationModal
      close={close}
      disabled={disableBtn}
      handleClose={handleClose}
      label={label}
      onClick={async () => await onClick(!member.active, newOwner)}
      open={open}
    >
      <RenderModalContent />
    </ConfirmationModal>
  )
}

export default ProjectConfirmationModal
