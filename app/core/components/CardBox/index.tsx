import React from "react"
import { CardBoxStyle } from "./CardBox.styles"

interface IProps {
  children: React.ReactNode
  title?: string
  centerText?: boolean
}

export const CardBox = ({ children, title, centerText = false }: IProps) => {
  return (
    <CardBoxStyle>
      {title != null ? (
        <div className={`CardBox--title ${centerText && "center-text"}`}>{title}</div>
      ) : (
        ""
      )}
      <div className="CardBox--content">{children}</div>
    </CardBoxStyle>
  )
}

export default CardBox
