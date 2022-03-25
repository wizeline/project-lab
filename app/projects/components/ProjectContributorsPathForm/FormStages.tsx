import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { Grid } from "@mui/material"
import { z } from "zod"
import { validateZodSchema } from "blitz"
export { FORM_ERROR } from "final-form"

export interface FormStagesProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  children?: ReactNode
  submitText?: string
  projectformType?: string
  schema?: S
  fullWidthButton?: boolean
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  disabled?: boolean
  projectId?: string
  retrieveProjectInfo?: Function
}

export default function FormStages<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  fullWidthButton,
  initialValues,
  onSubmit,
  disabled,
  ...props
}: FormStagesProps<S>) {
  const { projectformType, ...validFormProps } = props
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError, values }) => (
        <form onSubmit={handleSubmit} className="form" {...validFormProps}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitText && (
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <button
                style={fullWidthButton ? { width: "100%" } : {}}
                className="primary"
                type="submit"
                disabled={submitting || disabled}
              >
                {submitText}
              </button>
            </Grid>
          )}

          <style global jsx>{`
            .form > * + * {
              margin-top: 1rem;
            }
          `}</style>
        </form>
      )}
    />
  )
}
