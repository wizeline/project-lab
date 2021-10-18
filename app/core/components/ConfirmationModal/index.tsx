import React from "react"
import ModalBox from "../../components/ModalBox"

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  label: string
  onClick: React.MouseEventHandler
  disabled: boolean
  className: string
}

export const ConfirmationModal = ({ children, ...props }: IProps) => {
  return (
    <ModalBox open={props.open} handleClose={props.handleClose}>
      {children}
      <br />
      <button
        type="button"
        className={`primary ${props.className}`}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.label}
      </button>
      &nbsp;
      <button type="button" className="primary default" onClick={props.handleClose}>
        Cancel
      </button>
    </ModalBox>
  )
}

export default ConfirmationModal
