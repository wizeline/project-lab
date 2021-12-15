import { useQuery } from "blitz"
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { Field } from "react-final-form"
import getCategories from "app/categories/queries/getCategories"
import { defaultCategory } from "app/core/utils/constants"

interface CategorySelectProps {
  name: string
  label: string
  helperText?: string
}

export const CategorySelect = ({ name, label, helperText }: CategorySelectProps) => {
  const [categories] = useQuery(getCategories, {})

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
              value={input.value.name ? input.value.name : defaultCategory}
              onChange={(event) => {
                const newValue = categories.find((item) => item.name === event.target.value)
                input.onChange(newValue)
              }}
            >
              {categories.map((item) => (
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

export default CategorySelect
