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
  const [inputAreaValue, setInputAreaValue] = useState("")
  const [editorError, setEditorError] = useState(false)
  const [editorStyle, setEditorStyle] = useState(editorStyleNormal)
  const notEmptyEditor = (value) => (value === "\\\n" || !value ? "Required" : undefined)

  return (
    <Field name={name} validate={notEmptyEditor}>
      {({ input, meta: { touched, error, submitError } }) => {
        const handleEditorChange = (value) => {
          input.onChange(value)
          if (error || value === "\\\n") {
            setEditorStyle(editorStyleAlert)
            setEditorError(true)
          } else {
            setEditorStyle(editorStyleNormal)
            setEditorError(false)
          }
          setInputAreaValue(value)
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div>
            <FormLabel error={error ? error.length > 0 : false} required>
              {label}
            </FormLabel>
            <Editor
              defaultValue={input.value}
              placeholder={'Press "/" to view content type options...'}
              onChange={(getValue) => handleEditorChange(getValue())}
              style={editorStyle}
            ></Editor>
            <FormHelperText error={error ? error.length > 0 : false}>
              {error && error.length > 0 ? (
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
            <div {...outerProps} style={{ display: "none" }}></div>
          </div>
        )
      }}
    </Field>
  )
}

export default TextEditor
