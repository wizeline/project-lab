import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import { Field } from "react-final-form"
// import getSkills from "app/skills/queries/getSkills"
// import getRelatedProjects from "app/projects/queries/getRelatedProjects"
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
    // WHERE VERSION A
    // {
    //   where: { NOT: [{ id: "f621e435-d930-41e7-9c87-76e2a419e53e" }] },
    // },
    // WHERE VERSION B
    {
      where: { name: { contains: searchTerm, mode: "insensitive" }, id: { not: thisProject } },
      orderBy: { id: "asc" },
    },
    { suspense: false }
  )

  const { projects, count } = data || { projects: ["1", "2"] }

  // const [dataB, { isLoadingB }] = useQuery(getRelatedProjects, {}, { suspense: false })
  // const { relatedProjects, countB } = dataB || { relatedProjects: ["1", "2"] }

  // const parsedRelated = relatedProjects.map((e: any) =>
  //   e.projectAId !== "87a26368-c115-4b1f-a4a1-e03202dfd14b"
  //     ? {
  //         id: e.projectA.id,
  //         name: e.projectA.name,
  //       }
  //     : {
  //         id: e.projectB.id,
  //         name: e.projectB.name,
  //       }
  // )

  const setSearchTermDebounced = debounce(setSearchTerm, 500)
  // return (
  //   <div>
  //     <p>the count: {JSON.stringify(count)} -- </p>
  //     {JSON.stringify(parsedRelated)}
  //   </div>
  // )

  return (
    <>
      <div>
        {/* <p>the count: {JSON.stringify(count)} -- </p> */}
        {/* {JSON.stringify(relatedProjects)} */}
      </div>
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
