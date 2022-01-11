import React from "react"
import styled from "styled-components"

interface ICircleProps {
  current?: boolean
}

export const CircleIcon = styled.div<ICircleProps>`
  width: ${(props) => (props.current ? "80px" : "60px")};
  height: ${(props) => (props.current ? "80px" : "60px")};
  border-radius: ${(props) => (props.current ? "80px" : "60px")};
  display: flex;
  justify-content: center
  align-items: center;
  align-self: center;
  border-width: 1px;
  border-style: solid;
  border-color: red;
`

export const LineIcon = styled.div`
  width: 40px;
  height: 2px;
  background-color: red;
  margin-left: 5px;
  margin-right: 5px;
`

interface ICardHeaderProps {
  current?: boolean
}

export const CardHeaderComponent = styled.div<ICardHeaderProps>`
  width: 100%;
  height: 100px;
  background-color: ${(props) => (props.current ? "#F62C3A" : "#9FA0A3")};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ArrowDownIcon = styled.div<ICardHeaderProps>`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  border-top: 10px solid ${(props) => (props.current ? "#F62C3A" : "#9FA0A3")};
`
