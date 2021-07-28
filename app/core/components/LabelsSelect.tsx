import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import Autocomplete from "@material-ui/core/Autocomplete"
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Field } from "react-final-form"
import FieldError from "./FieldError"
import getLabels from "app/labels/queries/getLabels"
import debounce from "lodash/debounce"

interface LabelsSelectProps {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function LabelsSelect({ name, label, outerProps }: LabelsSelectProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [{ labels }, { isLoading }] = useQuery(getLabels, {
    where: { name: { contains: searchTerm } },
    orderBy: { id: "asc" },
  })

  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  return (
    <Field name={name}>
      {({ input, meta: { submitting } }) => (
        <div {...outerProps}>
          <label>
            {label}
            <Autocomplete
              multiple={true}
              sx={{ width: 300 }}
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
          </label>

          <FieldError name={name} />
        </div>
      )}
    </Field>
  )
}

export default LabelsSelect
