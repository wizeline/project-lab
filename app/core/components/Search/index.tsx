import { useState } from "react"
import { Router, useRouterQuery } from "blitz"
import { Box, InputAdornment, TextField } from "@mui/material"
import styled from "@emotion/styled"
import SearchIcon from "@mui/icons-material/Search"

export const Wrapper = styled.div`
  max-width: 997px;
  margin-left: auto;
  margin-right: 20px;
  margin-bottom: 15px;

  .CardBox--content {
    margin-top: 0;
    display: flex;
    justify-content: flex-end;
  }

  .search__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
`

export const Search = () => {
  const routerQuery = useRouterQuery()
  const searchQuery = routerQuery.q !== "myProposals" && routerQuery.q ? routerQuery.q : ""
  const [searchValue, setSearchValue] = useState(searchQuery)
  const projectsSearch = "/projects/search"

  const goToSearch = () => {
    const route = searchValue ? `/projects/search?q=${searchValue}` : projectsSearch
    Router.push(route)
  }

  // const clearSearch = () => {
  //   setSearchValue("")
  //   Router.push(projectsSearch)
  // }

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      goToSearch()
    }
  }

  return (
    <Wrapper>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          height: "40px",
        }}
      >
        <TextField
          label="Search Project Name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "150px",
            height: "30px",
            "& .MuiInput-root": { marginTop: "10px" },
            "& .MuiInputLabel-root": { fontSize: "15px", lineHeight: "13px", top: "-5px" },
            "& .MuiInputLabel-shrink": { top: "0" },
            "& .MuiOutlinedInput-input": { fontSize: "13px" },
            "& .MuiOutlinedInput-root": { height: "35px" },
          }}
          onKeyPress={(e) => {
            handleEnterKeyPress(e)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/* {routerQuery.q ? (
          <button type="button" className="primary search default" onClick={clearSearch}>
            Clear
          </button>
        ) : (
          ""
        )} */}
      </Box>
    </Wrapper>
  )
}

export default Search
