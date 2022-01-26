import React from "react"
import ModalBox from "../../components/ModalBox"
import { Button } from "@mui/material"

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  close: Function
  label: string
  onClick: React.MouseEventHandler
  disabled: boolean
  className: string
}

export const ConfirmationModal = ({ children, ...props }: IProps) => {
  return (
    <ModalBox open={props.open} close={props.close} handleClose={props.handleClose}>
      {children}
      <br />
      <Button
        className={`primary ${props.className}`}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.label}
      </Button>
      &nbsp;
      <Button className="primary default" onClick={props.handleClose}>
        Cancel
      </Button>
    </ModalBox>
  )
}

export default ConfirmationModal
