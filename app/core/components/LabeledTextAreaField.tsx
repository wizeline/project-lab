import { PropsWithoutRef } from "react"
import styled from "@emotion/styled"
import { Field } from "react-final-form"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import FieldError from "./FieldError"

interface LabeledTextAreaFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["textarea"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function LabeledTextAreaField({
  name,
  label,
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
          </LabelComponent>

          <FieldError name={name} />
        </div>
      )}
    </Field>
  )
}

const LabelComponent = styled.label`
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: 1rem;
`

export default LabeledTextAreaField
