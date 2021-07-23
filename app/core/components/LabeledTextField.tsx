import { PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import FieldError from "./FieldError"

interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function LabeledTextField({
  name,
  label,
  type,
  outerProps,
  ...props
}: LabeledTextFieldProps) {
  return (
    <Field name={name}>
      {({ input, meta: { submitting } }) => (
        <div {...outerProps}>
          <label>
            {label}
            <input {...input} type={type} disabled={submitting} {...props} />
          </label>

          <FieldError name={name} />

          <style jsx>{`
            label {
              display: flex;
              flex-direction: column;
              align-items: start;
              font-size: 1rem;
            }
            input {
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

export default LabeledTextField
