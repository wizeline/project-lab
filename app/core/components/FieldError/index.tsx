import { useField } from "react-final-form"

export const FieldError = ({ name }) => {
  const {
    meta: { touched, error, submitError },
  } = useField(name, { subscription: { touched: true, error: true } })
  const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

  return touched && normalizedError ? (
    <div role="alert" style={{ color: "red" }}>
      {normalizedError}
    </div>
  ) : null
}

export default FieldError
