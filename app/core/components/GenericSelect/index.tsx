import { Fragment, PropsWithoutRef, useContext, useState } from "react"
import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import { Field } from "react-final-form"
import debounce from "lodash/debounce"

export type SelectProps = {
  defaultValue?: any[]
  customOnChange?: (arg: any) => void
  fullWidth?: boolean
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  size?: "small" | "medium" | undefined
  style?: object
}

export type GenericSelectProps = SelectProps & {
  options: any[]
  isLoading: boolean
  setSearchTerm: (arg: string) => void
}

export const GenericSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
  options,
  isLoading,
  setSearchTerm,
}: GenericSelectProps) => {
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
              fullWidth={fullWidth ? fullWidth : false}
              style={style ? style : { margin: "1em 0" }}
              disabled={submitting}
              loading={isLoading || !options}
              options={options}
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
  )
}

export default GenericSelect
