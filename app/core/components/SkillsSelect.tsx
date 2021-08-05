import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import Autocomplete from "@material-ui/core/Autocomplete"
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Field } from "react-final-form"
import getSkills from "app/skills/queries/getSkills"
import debounce from "lodash/debounce"

interface SkillsSelectProps {
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function SkillsSelect({ name, label, helperText, outerProps }: SkillsSelectProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [{ skills }, { isLoading }] = useQuery(getSkills, {
    where: { name: { contains: searchTerm } },
    orderBy: { id: "asc" },
  })

  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div {...outerProps}>
            <Autocomplete
              multiple={true}
              sx={{ width: 300 }}
              disabled={submitting}
              loading={isLoading}
              options={skills}
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              onInputChange={(_, value) => setSearchTermDebounced(value)}
              value={input.value}
              onChange={(_, value) => {
                input.onChange(value)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={isError}
                  helperText={isError ? error : helperText}
                  disabled={submitting}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                />
              )}
            />
          </div>
        )
      }}
    </Field>
  )
}

export default SkillsSelect
