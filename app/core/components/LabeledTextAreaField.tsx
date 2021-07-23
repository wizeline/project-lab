import { PropsWithoutRef } from "react"
import { Field } from "react-final-form"
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
          <label>
            {label}
            <textarea {...input} disabled={submitting} {...props} />
          </label>

          <FieldError name={name} />

          <style jsx>{`
            label {
              display: flex;
              flex-direction: column;
              align-items: start;
              font-size: 1rem;
            }
            textarea {
              font-size: 1rem;
              padding: 0.25rem 0.5rem;
              border-radius: 3px;
              border: 1px solid purple;
              appearance: none;
              margin-top: 0.5rem;
            }
          `}</style>
        </div>
      )}
    </Field>
  )
}

export default LabeledTextAreaField
