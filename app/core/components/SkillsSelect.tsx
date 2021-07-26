import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import Autocomplete from "@material-ui/core/Autocomplete"
import TextField from "@material-ui/core/TextField"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Field } from "react-final-form"
import FieldError from "./FieldError"
import getSkills from "app/skills/queries/getSkills"
import debounce from "lodash/debounce"

interface SkillsSelectProps {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function SkillsSelect({ name, label, outerProps }: SkillsSelectProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [{ skills }, { isLoading }] = useQuery(getSkills, {
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
              options={skills}
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              onInputChange={(_, value) => setSearchTermDebounced(value)}
              value={input.value}
              onChange={(_, value) => {
                console.log(value)
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

export default SkillsSelect
