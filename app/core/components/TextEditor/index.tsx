import { useState, useEffect, PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import TextField from "@material-ui/core/TextField"
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
  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        // useEffect(() => {
        //   setInputAreaValue(input.value)
        // }, [])
        const handleEditorChange = (getValue, input) => {
          console.log("Change the value on text area")
          setInputAreaValue(getValue())
          console.log(initialValues)
          console.log("Hi Valeus")
          console.log(input)
          input.onChange(inputAreaValue)
          console.log(input)
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <>
            {/* <p>{JSON.stringify(input)}</p>
            <p>{JSON.stringify(props)}</p>
            <p>{JSON.stringify(outerProps)}</p> */}
            {/* <InputLabel htmlFor={input.name} >{label}</InputLabel> */}
            <Editor
              // {...props}
              defaultValue={input.value}
              onChange={(getValue) => handleEditorChange(getValue, input)}
              onSave={() => console.log("hi")}
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
          </>
        )
      }}
    </Field>
  )
}

export default TextEditor
