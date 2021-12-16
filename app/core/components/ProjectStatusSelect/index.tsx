import { useQuery } from "blitz"
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { Field } from "react-final-form"
import getStatuses from "app/statuses/queries/getStatuses"
import { defaultStatus } from "app/core/utils/constants"

interface ProjectStatusSelectProps {
  name: string
  label: string
  helperText?: string
}

export const ProjectStatusSelect = ({ name, label, helperText }: ProjectStatusSelectProps) => {
  const [statuses] = useQuery(getStatuses, {})

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <FormControl fullWidth id={name} error={isError} margin="normal">
            <InputLabel id={name}>{label}</InputLabel>
            <Select
              style={{ width: "100%" }}
              id={name}
              sx={{ width: 300 }}
              label={label}
              disabled={submitting}
              value={input.value.name ? input.value.name : defaultStatus}
              onChange={(event) => {
                const newValue = statuses.find((item) => item.name === event.target.value)
                input.onChange(newValue)
              }}
            >
              {statuses.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{isError ? error : helperText}</FormHelperText>
          </FormControl>
        )
      }}
    </Field>
  )
}

export default ProjectStatusSelect
