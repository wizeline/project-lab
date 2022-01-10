import styled from "@emotion/styled"
import { Button } from "@mui/material"
import ModalBox from "app/core/components/ModalBox"

export const Grid = styled.div`
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  color: #545454;
  font-size: 0.8rem;
  font-weight: 300;

  @media (max-width: 768px) {
    row-gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    max-height: 75vh;
    overflow: scroll;
  }
`
export const FormDivContainer = styled.div`
  h1 {
    margin: 0.5rem 0 1rem 0;
  }

  .question {
    margin-top: 0.5rem !important;
    margin-bottom: 0.7rem;
  }
`

export const CommitmentDivContainer = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    margin: 1rem 0 1.5rem 0;
    color: #ff6f18;
    font-weight: bold;
  }

  .paragraph {
    flex: 1;
    overflow: scroll;
    max-height: 400px;
  }
`

export const ModalResponsive = styled(ModalBox)`
  width: 800px;

  @media screen and (max-width: 850px) {
    width: 90%;
  }
`

export const OrangeColoredButton = styled(Button)`
  margin-top: 1.5rem;
  background-color: #ff6f18;
  font-weight: bold;

  &:hover {
    background-color: #e56315;
  }
`
