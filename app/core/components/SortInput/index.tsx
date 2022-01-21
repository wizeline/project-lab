import React, { useEffect, useState } from "react"
import { MenuItem, TextField } from "@mui/material"

interface iProps {
  setSortQuery: (query: { field: string; order: string }) => void
}

export const SortInput = ({ setSortQuery }: iProps) => {
  const [sortBy, setSortBy] = useState("")

  //sorting options
  const sortOptions = [
    {
      label: "Most recent",
      value: "mostRecent",
    },
    {
      label: "Most voted",
      value: "mostVoted",
    },
  ]

  const handleSortByChange = (e) => {
    setSortBy(e.target.value)
  }

  useEffect(() => {
    if (sortBy === "mostRecent") {
      setSortQuery({ field: "createdAt", order: "desc" })
    }
    if (sortBy === "mostVoted") {
      setSortQuery({ field: "votesCount", order: "desc" })
    }
  }, [sortBy, setSortQuery])

  return (
    <TextField
      select
      label="Sort By"
      value={sortBy}
      onChange={handleSortByChange}
      sx={{
        width: "120px",
      }}
      size="small"
      InputProps={{ style: { fontSize: "13px" } }}
    >
      {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
