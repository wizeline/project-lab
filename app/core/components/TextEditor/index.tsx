import { useState, useEffect, PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import FormLabel from "@material-ui/core/FormLabel"
import FormHelperText from "@material-ui/core/FormHelperText"
import Editor from "rich-markdown-editor"
const editorStyleNormal = {
  border: "1px solid #999",
  padding: "1em 1em 1em 2em",
  borderRadius: "4px",
  borderColor: "rgba(0, 0, 0, 0.23)",
}

const editorStyleAlert = {
  border: "1px solid #999",
  padding: "1em 1em 1em 2em",
  borderRadius: "4px",
  borderColor: "#d32f2f",
}

interface TextEditorProps {
  name: string
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  helperText?: string
  placeholder?: string
  fullWidth?: boolean
  style?: any
  initialValues?: any
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}
console.log(Field)
export const TextEditor = ({
  name,
  label,
  type,
  helperText,
  outerProps,
  initialValues,
  ...props
}: TextEditorProps) => {
  const [editorError, setEditorError] = useState(false)
  const notEmptyEditor = (value) => (value === "\\\n" || !value ? "Required" : undefined)

  return (
    <Field name={name} validate={notEmptyEditor}>
      {({ input, meta: { touched, error, submitError } }) => {
        const handleEditorChange = (value) => {
          input.onChange(value)
          if (isError || value === "\\\n") {
            setEditorError(true)
          } else {
            setEditorError(false)
          }
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div>
            <FormLabel
              error={(isError || editorError) && error ? error.length > 0 : false}
              required
            >
              {label}
            </FormLabel>
            <Editor
              defaultValue={input.value}
              placeholder={"Press '/' to view content type options..."}
              onChange={(getValue) => handleEditorChange(getValue())}
              style={(isError || editorError) && error ? editorStyleAlert : editorStyleNormal}
            ></Editor>
            <FormHelperText error={(isError || editorError) && error ? error.length > 0 : false}>
              {isError && error.length > 0 ? (
                <>
                  {error}
                  <br />
                </>
              ) : (
                helperText
              )}
              Press "return" twice if you wish to start a new line of text with a different content
              type. You can use "Markdown" language if you like
            </FormHelperText>
          </div>
        )
      }}
    </Field>
  )
}

export default TextEditor
