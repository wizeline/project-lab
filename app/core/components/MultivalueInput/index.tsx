import React, { useState } from "react"
import { Chip, Grid, TextField } from "@mui/material"
import { Field } from "react-final-form"

interface ProfilesSelectProps {
  name: string
  label: string
  helperText?: string
}

export const MultiValueField = ({ name, label }: ProfilesSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError } }) => {
        const addOption = () => {
          if (inputValue) {
            input.onChange([...input.value, { url: inputValue }])
            setInputValue("")
          }
        }

        const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
          e.stopPropagation()
          if (e.key === "Enter") {
            addOption()
          }
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError !== undefined
        return (
          <>
            <TextField
              label={label}
              error={isError}
              {...input}
              value={inputValue}
              onKeyDown={(e) => handleEnterKeyPress(e)}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
            />
            <Grid
              container
              xs={12}
              spacing={1}
              rowSpacing={{ xs: 2, sm: 1 }}
              style={{ paddingTop: 20 }}
            >
              {input.value.length > 0 &&
                input.value.map((row, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <Chip
                        onDelete={() => {
                          input.onChange(input.value.filter((url) => url.url !== row.url))
                        }}
                        label={row.url}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
            </Grid>
          </>
        )
      }}
    </Field>
  )
}

export default MultiValueField
