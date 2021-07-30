import { PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import TextField from "@material-ui/core/TextField"

interface LabeledTextFieldProps {
  name: string
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  helperText?: string
  placeholder?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function LabeledTextField({
  name,
  label,
  type,
  helperText,
  outerProps,
  ...props
}: LabeledTextFieldProps) {
  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div {...outerProps}>
            <TextField
              {...input}
              label={label}
              error={isError}
              helperText={isError ? error : helperText}
              type={type}
              disabled={submitting}
              {...props}
            />
          </div>
        )
      }}
    </Field>
  )
}

export default LabeledTextField
