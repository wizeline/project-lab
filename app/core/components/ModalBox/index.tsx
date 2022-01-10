import React from "react"
import { Modal, Box } from "@mui/material"
import styled from "@emotion/styled"

export const BoxContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
`

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  boxStyle?: React.CSSProperties
}

export const ModalBox = ({ children, boxStyle, ...props }: IProps) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <BoxContainer style={boxStyle} {...props}>
          <Box sx={{ marginTop: "0px" }}>{children}</Box>
        </BoxContainer>
      </ModalContainer>
    </Modal>
  )
}

export default ModalBox
