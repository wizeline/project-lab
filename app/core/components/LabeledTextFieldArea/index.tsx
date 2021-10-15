import { PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import TextField from "@material-ui/core/TextField"

interface LabeledTextFieldAreaProps {
  name: string
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  helperText?: string
  placeholder?: string
  fullWidth?: boolean
  style?: any
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextFieldArea = ({
  name,
  label,
  type,
  helperText,
  outerProps,
  ...props
}: LabeledTextFieldAreaProps) => {
  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div {...outerProps}>
            <TextField
              multiline
              rows={4}
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

export default LabeledTextFieldArea
