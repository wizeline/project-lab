import { useState } from "react"
import { Router, useRouterQuery } from "blitz"
import { Box, TextField } from "@material-ui/core"
import CardBox from "app/core/components/CardBox"
import styled from "@emotion/styled"

export const Wrapper = styled.div`
  max-width: 997px;
  margin-top: 35px;
  margin-left: auto;
  margin-right: auto;

  .CardBox--content {
    margin-top: 0;
    display: flex;
    justify-content: flex-end;
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

  return (
    <Wrapper>
      <CardBox>
        <Box component="div">
          <TextField
            variant="outlined"
            label="Project Name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="button" className="primary search" onClick={goToSearch}>
            Search
          </button>
          {routerQuery.q ? (
            <button type="button" className="primary search default" onClick={clearSearch}>
              Clear
            </button>
          ) : (
            ""
          )}
        </Box>
      </CardBox>
    </Wrapper>
  )
}

export default Search
