import React from "react"
import { CardBoxStyle } from "./CardBox.styles"

interface IProps {
  children: React.ReactNode
  title: String
}

export const CardBox = ({ children, title }: IProps) => {
  return (
    <CardBoxStyle>
      <div className="CardBox--title">{title}</div>
      <div className="CardBox--content">{children}</div>
    </CardBoxStyle>
  )
}

export default CardBox
