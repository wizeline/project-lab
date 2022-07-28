import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import getProfiles from "app/profiles/queries/searchProfiles"
import debounce from "lodash/debounce"

interface MenteesFieldProps {
  defaultValue?: any[]
  onChange: (idx: number, arg: any, mentorProfileId: string) => void
  fullWidth?: boolean
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  size?: "small" | "medium" | undefined
  style?: object
  submitting?: boolean
  inputValue: any
  idx: number
  label?: string
  mentorProfileId: string
}

export const MenteesField = ({
  onChange,
  inputValue,
  fullWidth,
  helperText,
  style,
  submitting = false,
  idx,
  label,
  mentorProfileId,
}: MenteesFieldProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [data, { isLoading }] = useQuery(getProfiles, searchTerm, { suspense: false })

  const profiles = data || []

  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  return (
    <Autocomplete
      multiple={false}
      fullWidth={fullWidth ? fullWidth : false}
      style={style ? style : { margin: "1em 0" }}
      disabled={submitting}
      loading={isLoading || !data}
      options={profiles}
      isOptionEqualToValue={(option, value) => value?.profileId === option?.profileId}
      getOptionLabel={(option) => option.name || ""}
      onInputChange={(_, value) => {
        setSearchTermDebounced(value)
      }}
      value={inputValue || null}
      onChange={(_, value) => {
        onChange(idx, value, mentorProfileId)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
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
          style={{ width: "100%", ...style }}
        />
      )}
    />
  )
}

export default MenteesField
