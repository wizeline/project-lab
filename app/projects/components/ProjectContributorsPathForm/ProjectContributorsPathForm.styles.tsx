import styled from "@emotion/styled"
import { TextField } from "@mui/material"
import Editor from "rich-markdown-editor"

export const TextFieldStyles = styled(TextField)`
  margin-top: 0.5em;
  margin-bottom: 1em;
`

export const StageStyles = styled.div`
  :not(:first-of-type) {
    ${"" /* border-top: 1px solid #ccc; */}
    padding-top: 1em;
  }
`

export const EditorStyles = styled(Editor)`
  margin-top: 0.5em;
  border: 1px solid;
  padding: 0 14px 1em 2em;
  min-height: 3em;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.23);
  cursor: auto;

  & + p {
    margin-bottom: 1em;
  }
`
// border-color: ${(props) => (props.errorStyles ? "#d32f2f" : "rgba(0, 0, 0, 0.23)")};

export const LabelStyles = styled.p`
  margin-bottom: 0.5em;
`

export const MultiColumnStyles = styled.div`
  display: flex;
  align-items: center;

  > div:first-of-type {
    flex-grow: 1;
    margin-right: 1.5em;
  }
`

export const LabelWithButtonDivStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const InstructionStyles = styled.p`
  color: #999;
  font-size: 0.8rem;
`
export const CollapsableHeader = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  align-items: center;
  background-color: #347ab7;
  border-radius: 4px;
  color: red;
  cursor: grab;
  padding: 10px 16px;
  & > h2,
  button {
    color: white;
  }
`
