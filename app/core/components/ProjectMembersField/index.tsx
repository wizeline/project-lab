import React, { Fragment, useState } from "react"
import { useQuery } from "blitz"
import {
  Autocomplete,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core"
import { Field } from "react-final-form"
import getProfiles from "app/profiles/queries/searchProfiles"
import debounce from "lodash/debounce"

interface ProfilesSelectProps {
  name: string
  label: string
  helperText?: string
}

export const ProjectMembersField = ({ name, label, helperText }: ProfilesSelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [profiles, { isLoading }] = useQuery(getProfiles, searchTerm)

  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <React.Fragment>
            <Autocomplete
              multiple={true}
              disabled={submitting}
              loading={isLoading}
              options={profiles}
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.profileId === value.profileId}
              getOptionLabel={(option) => option.name}
              onInputChange={(_, value) => setSearchTermDebounced(value)}
              value={input.value}
              onChange={(_, value, reason) => {
                if (reason === "selectOption") {
                  input.onChange(value)
                }
              }}
              renderTags={() => null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={isError}
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
            <Grid container spacing={1} style={{ paddingTop: 20 }}>
              {input.value.map((row, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={5}>
                    <Chip
                      onDelete={() => {
                        input.onChange(
                          input.value.filter((member) => member.profileId !== row.profileId)
                        )
                      }}
                      label={
                        row.name ? row.name : `${row.profile?.firstName} ${row.profile?.lastName}`
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Role"
                      defaultValue={row.role}
                      size="small"
                      onChange={(event) => {
                        row.role = event.target.value
                        input.onChange(input.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Hours"
                      helperText="H. per week"
                      size="small"
                      type="number"
                      defaultValue={row.hoursPerWeek}
                      onChange={(event) => {
                        row.hoursPerWeek = event.target.value
                        input.onChange(input.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormControlLabel
                      label="Active"
                      control={
                        <Checkbox
                          size="small"
                          defaultChecked={row.active === false ? false : true}
                          onChange={(event) => {
                            row.active = event.target.checked
                            input.onChange(input.value)
                          }}
                        />
                      }
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </React.Fragment>
        )
      }}
    </Field>
  )
}

export default ProjectMembersField