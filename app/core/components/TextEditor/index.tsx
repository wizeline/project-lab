import { useState, useEffect, PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import TextField from "@material-ui/core/TextField"
import FormLabel from "@material-ui/core/FormLabel"
// import InputLabel from "@material-ui/core/InputLabel"
import Editor from "rich-markdown-editor"
// import styled from "styled-components"

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
  // const [inputAreaValue, setInputAreaValue] = useState("")
  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const handleEditorChange = (value) => {
          console.log(value)
          setInputAreaValue(value)
          input.onChange(value)
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div>
            <FormLabel error={isError} required>
              {label}
            </FormLabel>
            <Editor
              // {...props}
              defaultValue={input.value}
              onChange={(getValue) => handleEditorChange(getValue())}
            ></Editor>
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
