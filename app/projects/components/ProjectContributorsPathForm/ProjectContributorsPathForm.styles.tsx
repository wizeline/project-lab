import styled from "@emotion/styled"
import { TextField } from "@mui/material"

export const TextFieldStyles = styled(TextField)`
  margint-top: 1.25em;
  margin-bottom: 1.25em;
`

export const StageStyles = styled.div`
  :not(:first-of-type) {
    border-top: 1px solid #ccc;
    padding-top: 2em;
  }
`
