import { useQuery } from "blitz"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import FormHelperText from "@material-ui/core/FormHelperText"
import { Field } from "react-final-form"
import getCategories from "app/categories/queries/getCategories"
import { defaultCategory } from "app/core/utils/constants"

interface CategorySelectProps {
  name: string
  label: string
  helperText?: string
}

export function CategorySelect({ name, label, helperText }: CategorySelectProps) {
  const [categories] = useQuery(getCategories, {})

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <FormControl id={name} error={isError}>
            <InputLabel id={name}>{label}</InputLabel>
            <Select
              id={name}
              sx={{ width: 300 }}
              label={label}
              disabled={submitting}
              defaultValue={defaultCategory}
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
