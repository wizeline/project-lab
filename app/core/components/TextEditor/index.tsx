import { useState, useEffect, PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import TextField from "@material-ui/core/TextField"
import FormLabel from "@material-ui/core/FormLabel"
import FormHelperText from "@material-ui/core/FormHelperText"
// import InputLabel from "@material-ui/core/InputLabel"
import Editor from "rich-markdown-editor"
// import styled from "styled-components"

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
  const [editorValid, setEditorValid] = useState(true)
  const [editorStyle, setEditorStyle] = useState(editorStyleNormal)
  // const [inputAreaValue, setInputAreaValue] = useState("")
  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const handleEditorChange = (value) => {
          console.log(value)
          console.log(error)
          console.log(touched)
          console.log(isError)
          console.log(value.length)
          input.onChange(value)
          if (isError || value == "\\\n") {
            // input.onChange('')
            setEditorStyle(editorStyleAlert)
            setEditorValid(false)
          } else {
            // input.onChange(value)
            setEditorStyle(editorStyleNormal)
            setEditorValid(true)
          }
          setInputAreaValue(value)
        }
        const normalizedError =
          Array.isArray(error) && !editorValid ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div>
            <FormLabel error={isError} required>
              {label}
            </FormLabel>
            <Editor
              // {...props}
              defaultValue={input.value}
              placeholder={"Press / to see content type options..."}
              onChange={(getValue) => handleEditorChange(getValue())}
              style={editorStyle}
            ></Editor>
            <FormHelperText>
              Press double "return" if you wish to start a new line of text with a different content
              type. You can use "Markdown" if you like
            </FormHelperText>
            <div {...outerProps} style={{ display: "none" }}>
              <TextField
                multiline
                rows={6}
                {...input}
                name={input.name}
                label={label}
                error={isError}
                helperText={isError ? error : helperText}
                type={type}
                disabled={submitting}
                // {...props}
              />
            </div>
          </div>
        )
      }}
    </Field>
  )
}

export default TextEditor
