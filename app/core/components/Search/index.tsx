import { useState } from "react"
import { Router, useRouterQuery } from "blitz"
import { Box, TextField } from "@mui/material"
import CardBox from "app/core/components/CardBox"
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
    cursor: pointer;
    color: #252a2f;
  }
`

export const Search = () => {
  const routerQuery = useRouterQuery()
  const searchQuery = routerQuery.q ?? ""
  const [searchValue, setSearchValue] = useState(searchQuery)
  const projectsSearch = "/projects/search"

  const goToSearch = () => {
    const route = searchValue ? `/projects/search?q=${searchValue}` : projectsSearch
    Router.push(route)
  }

  const clearSearch = () => {
    setSearchValue("")
    Router.push(projectsSearch)
  }

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      goToSearch()
    }
  }

  return (
    <Wrapper>
      <Box
        component="div"
        sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: "40px" }}
      >
        {/* <TextField
          variant="standard"
          label="Project Name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "100px",
            "& .MuiInput-root": { marginTop: "10px" },
            "& .MuiInputLabel-root": { fontSize: "13px" },
            "& .MuiInput-input": { fontSize: "13px" },
          }}
          onKeyPress={(e) => {
            handleEnterKeyPress(e)
          }}
        /> */}
        <TextField
          label="Project Name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: "110px",
            height: "30px",
            "& .MuiInput-root": { marginTop: "10px" },
            "& .MuiInputLabel-root": { fontSize: "12px", lineHeight: "13px", top: "-5px" },
            "& .MuiInputLabel-shrink": { top: "0" },
            "& .MuiOutlinedInput-input": { fontSize: "13px" },
            "& .MuiOutlinedInput-root": { height: "30px" },
          }}
          onKeyPress={(e) => {
            handleEnterKeyPress(e)
          }}
        />
        <div onClick={goToSearch} className="search__icon">
          <SearchIcon />
        </div>
        {routerQuery.q ? (
          <button type="button" className="primary search default" onClick={clearSearch}>
            Clear
          </button>
        ) : (
          ""
        )}
      </Box>
    </Wrapper>
  )
}

export default Search
