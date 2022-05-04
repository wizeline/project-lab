import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useQuery } from "blitz"
import { Field } from "react-final-form"
import debounce from "lodash/debounce"

import getSkills from "app/skills/queries/getSkills"
import getDisciplines from "app/disciplines/queries/getDisciplines"
import getLabels from "app/labels/queries/getLabels"

import type { TextFieldProps } from "@mui/material"
import type { CSSProperties, PropsWithoutRef } from "react"

const queryMapper = {
  skills: {
    label: "Skills",
    source: getSkills,
  },
  disciplines: {
    label: "Disciplines",
    source: getDisciplines,
  },
  labels: {
    label: "Labels",
    source: getLabels,
  },
}

interface LabSelectProps {
  type: keyof typeof queryMapper
  name: string
  label?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  fullWidth?: boolean
  helperText?: string
  size?: TextFieldProps["size"]
  customOnChange?: (arg: any) => void
  defaultValue?: any[]
  style?: CSSProperties
}

export const LabSelect: React.FC<LabSelectProps> = ({
  name,
  label,
  helperText,
  fullWidth,
  outerProps,
  type,
  size,
  customOnChange,
  defaultValue = [],
  style,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedEventHandler = useMemo(() => debounce(setSearchTerm, 500), [])

  useEffect(() => {
    return () => {
      debouncedEventHandler.cancel()
    }
  }, [debouncedEventHandler])

  const [data, { isLoading }] = useQuery(
    queryMapper[type].source,
    {
      where: { name: { contains: searchTerm } },
      orderBy: { id: "asc" },
    },
    { suspense: false }
  )

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div {...outerProps}>
            <Autocomplete
              multiple
              fullWidth={fullWidth}
              disabled={submitting}
              loading={isLoading}
              options={data?.items || []}
              filterSelectedOptions
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              style={style ? style : { margin: "1em 0" }}
              onInputChange={(_, value) => debouncedEventHandler(value)}
              value={input.value ? input.value : defaultValue}
              onChange={(_, value) => {
                input.onChange(value)
                if (customOnChange) customOnChange(value)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={isError}
                  helperText={isError ? error : helperText}
                  label={label || queryMapper[type].label}
                  disabled={submitting}
                  fullWidth
                  size={size}
                  style={style}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {isLoading && <CircularProgress color="inherit" size={20} />}
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
