import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import { Autocomplete, TextField, CircularProgress } from "@mui/material"
import { Field } from "react-final-form"
import getLabels from "app/labels/queries/getLabels"
import debounce from "lodash/debounce"

interface LabelsSelectProps {
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabelsSelect = ({ name, label, helperText, outerProps }: LabelsSelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [{ labels }, { isLoading }] = useQuery(getLabels, {
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
              fullWidth
              style={{ margin: "1em 0" }}
              disabled={submitting}
              loading={isLoading}
              options={labels}
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

export default LabelsSelect
