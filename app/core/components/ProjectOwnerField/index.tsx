import React, { useState } from "react"
import { useQuery } from "blitz"
import { Autocomplete, TextField } from "@material-ui/core"
import { Field } from "react-final-form"
import getProfiles from "app/profiles/queries/searchProfiles"

interface ProfilesSelectProps {
  name: string
  label: string
  owner: object
  helperText?: string
}

export const ProjectOwnerField = ({ name, label, owner, helperText }: ProfilesSelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [profiles, { isLoading }] = useQuery(getProfiles, searchTerm)
  const [value, setValue] = useState(owner)
  const [inputValue, setInputValue] = useState("")

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <Autocomplete
            id={name}
            loading={isLoading}
            value={value}
            onChange={(event: any, newValue: any | null, reason) => {
              if (reason === "selectOption") {
                setValue(newValue)
                input.onChange({ id: newValue.profileId })
              }
            }}
            inputValue={inputValue}
            isOptionEqualToValue={(option, value) => option.profileId === value.profileId}
            getOptionLabel={(option) => option.name}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            options={profiles}
            renderInput={(params) => (
              <TextField
                {...params}
                id={name}
                label={label}
                error={isError}
                disabled={submitting}
              />
            )}
          />
        )
      }}
    </Field>
  )
}

export default ProjectOwnerField
