import { Router, Routes } from "blitz"
import styled from "@emotion/styled"

const Wrapper = styled.div`
  button {
    background-image: url(/add.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 5px 50%;
    border: none;
    color: #ffffff;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 600;
    width: 120px;
    letter-spacing: 0;
    line-height: 27px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #e94d44;
    padding: 4px 4px 4px 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  }
`

export const NewProposalButton = () => {
  const goToCreateNewProposal = () => {
    Router.push(Routes.NewProjectPage())
  }
  return (
    <Wrapper>
      <button onClick={goToCreateNewProposal}>New proposal</button>
    </Wrapper>
  )
}
