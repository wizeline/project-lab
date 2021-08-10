import React from "react"
import styled from "@emotion/styled"

interface IProps {
  children: React.ReactNode
  title: String
}

function CardBox({ children, title }: IProps) {
  return (
    <>
      <CardBoxStyle>
        <div className="CardBox--title">{title}</div>
        <div className="CardBox--content">{children}</div>
      </CardBoxStyle>
    </>
  )
}

const CardBoxStyle = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 7px;
  height: 100%;
  .CardBox--title {
    color: #252a2f;
    font-size: 22px;
    font-weight: 700;
  }
  .CardBox--content {
    margin-top: 20px;
  }
`

export default CardBox
