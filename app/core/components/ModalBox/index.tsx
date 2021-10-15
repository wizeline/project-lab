import React from "react"
import { Modal, Box } from "@material-ui/core"
import styled from "@emotion/styled"

export const BoxContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
`

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  height: number
}

export const ModalBox = ({ children, ...props }: IProps) => {
  const marginTop = (window.innerHeight - props.height) / 2 + "px"

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ marginTop }}>
        <BoxContainer>{children}</BoxContainer>
      </Box>
    </Modal>
  )
}

export default ModalBox
