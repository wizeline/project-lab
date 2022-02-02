import React, { useState } from "react"
import { MenuItem, TextField } from "@mui/material"

interface iProps {
  setFilterQuery: (event: Event, filter: string) => void
  label: string
  filterOptions: { name: string; count: number }[]
  deleteFilter: (filter: string) => void
}

export const MobileFilter = ({ filterOptions, label, setFilterQuery, deleteFilter }) => {
  const [filterBy, setFilterBy] = useState("")

  const handleFilterByChange = (e) => {
    if (e.target.value === "") {
      console.log(filterOptions)
      deleteFilter(filterBy)
      setFilterBy("")
    } else {
      e.target.id = e.target.value
      setFilterBy(e.target.value)
      setFilterQuery(e, label)
    }
  }

  return (
    <TextField
      select
      label={label}
      value={filterBy}
      onChange={(e) => handleFilterByChange(e)}
      sx={{
        width: "120px",
        marginBottom: "10px",
      }}
      size="small"
      InputProps={{ style: { fontSize: "13px" } }}
    >
      <MenuItem value="">None</MenuItem>
      {filterOptions.map((option) => (
        <MenuItem key={option.name} value={option.name} id={option.name}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  )
}
