import styled from "@emotion/styled"
import { TextField } from "@mui/material"
import Editor from "rich-markdown-editor"

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

export const EditorStyles = styled(Editor)`
  margint-top: 1.25em;
  border: 1px solid;
  padding: 0 14px 1em 2em;
  min-height: 3em;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.23);

  & + p {
    margin-bottom: 1.25em;
  }
`
// border-color: ${(props) => (props.errorStyles ? "#d32f2f" : "rgba(0, 0, 0, 0.23)")};
