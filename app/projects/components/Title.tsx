import styled from "@emotion/styled"
import React from "react"

const TitleComponent = styled.div`
  color: #252a2f;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 30px;
`

interface IProps {
  children: React.ReactNode
}

const Title = ({ children }: IProps) => {
  return <TitleComponent>{children}</TitleComponent>
}

export default Title
