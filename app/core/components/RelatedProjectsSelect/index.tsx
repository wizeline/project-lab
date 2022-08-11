import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import { Field } from "react-final-form"
import getProjects from "app/projects/queries/getProjects"
import debounce from "lodash/debounce"

interface RelatedProjectsSelectProps {
  defaultValue?: any[]
  customOnChange?: (arg: any) => void
  fullWidth?: boolean
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  size?: "small" | "medium" | undefined
  style?: object
  thisProject?: any
}

export const RelatedProjectsSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
  thisProject,
}: RelatedProjectsSelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [data, { isLoading }] = useQuery(
    getProjects,
    {
      where: { name: { contains: searchTerm, mode: "insensitive" }, id: { not: thisProject } },
      orderBy: { id: "asc" },
    },
    { suspense: false }
  )

  const { projects, count } = data || { projects: [] }

  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  return (
    <>
      <Field name={name}>
        {({ input, meta: { touched, error, submitError, submitting } }) => {
          const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
          const isError = touched && normalizedError
          return (
            <div {...outerProps}>
              <Autocomplete
                multiple={true}
                fullWidth={fullWidth ? fullWidth : false}
                style={style ? style : { margin: "1em 0" }}
                disabled={submitting}
                loading={isLoading || !data}
                options={projects}
                filterOptions={(x) => x}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onInputChange={(_, value) => setSearchTermDebounced(value)}
                value={input.value ? input.value : defaultValue}
                onChange={(_, value) => {
                  input.onChange(value)
                  if (customOnChange) customOnChange(value)
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
                    size={size}
                    style={{ width: "100%", ...style }}
                  />
                )}
              />
            </div>
          )
        }}
      </Field>
    </>
  )
}

export default RelatedProjectsSelect
