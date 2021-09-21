import { PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import { TextareaAutosize, FormHelperText } from "@material-ui/core"
import FieldError from "../FieldError"

import { LabelComponent } from "./LabeledTextAreaField.styles"

interface LabeledTextAreaFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["textarea"]> {
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function LabeledTextAreaField({
  name,
  label,
  helperText,
  outerProps,
  ...props
}: LabeledTextAreaFieldProps) {
  return (
    <Field name={name}>
      {({ input, meta: { submitting } }) => (
        <div {...outerProps}>
          <LabelComponent>
            {label}
            <TextareaAutosize {...input} disabled={submitting} minRows={3} {...props} />
            <FormHelperText>{helperText}</FormHelperText>
          </LabelComponent>

          <FieldError name={name} />
        </div>
      )}
    </Field>
  )
}

export default LabeledTextAreaField
