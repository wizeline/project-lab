import { Suspense, useState } from "react"
import styled from "@emotion/styled"
import { Head, Link, useQuery, useRouter, Router, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import searchProjects from "app/projects/queries/searchProjects"
import CardBox from "app/core/components/CardBox"
import ProposalCard from "app/core/components/ProposalCard"

import Header from "app/core/layouts/Header"
import { Box, TextField } from "@material-ui/core"

const ITEMS_PER_PAGE = 4

const ProjectsPage: BlitzPage = () => {
  //functions to load and paginate projects in `Popular` CardBox
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [searchValue, setSearchValue] = useState("")

  const search = router.query.q || ""
  const categories = router.query.cat || ""
  const skills = router.query.sk || ""
  const labels = router.query.lb || ""

  const [{ projects, hasMore, categoryFacets, skillFacets, labelFacets }] = useQuery(
    searchProjects,
    {
      search,
      categories,
      skills,
      labels,
      skip: ITEMS_PER_PAGE * page,
      take: ITEMS_PER_PAGE,
    }
  )
  const goToPreviousPage = () => router.push({ query: { page: page - 1, q: search } })
  const goToNextPage = () => router.push({ query: { page: page + 1, q: search } })

  //function to render projects in a Proposals CardBox
  const mapRenderProposals = (item, i) => {
    return (
      <ProposalCard
        id={item.id}
        title={item.name}
        date={item.createdAt}
        description={item.description}
        status={item.status}
        color={item.color}
        votesCount={item.votesCount}
      />
    )
  }

  const goToCreateNewProposal = () => {
    Router.push(Routes.NewProjectPage())
  }

  const goToSearch = () => {
    const route = searchValue ? `search?q=${searchValue}` : "search"
    Router.push(route)
  }

  const goToSearchWithFilters = (elem, filter) => {
    const { id } = elem

    const route =
      filter === "category"
        ? `search?cat=${id}`
        : filter === "skill"
        ? `search?sk=${id}`
        : filter === "label"
        ? `search?lb=${id}`
        : "search"
    Router.push(route)
  }

  return (
    <div>
      <Header title="Projects" />
      <Wrapper className="homeWrapper">
        <div className="homeWrapper__navbar">
          <div className="homeWrapper__navbar__categories">
            <div className="homeWrapper__navbar__categories--title">Categories:</div>
            <div className="homeWrapper__navbar__categories--list">
              <ul>
                <li>People Ops</li>
                <li>Engineering</li>
                <li>Ux</li>
              </ul>
            </div>
          </div>
          <div className="homeWrapper__navbar__button">
            <button onClick={goToCreateNewProposal}>New proposal</button>
          </div>
        </div>
        <div className="homeWrapper--content">
          <div className="homeWrapper__myProposals">
            <CardBox title="Filters">
              <div className="homeWrapper__myProposals">
                <h3>{categoryFacets.length > 0 ? "Categories" : ""}</h3>
                <ul>
                  {categoryFacets.map((item) => (
                    <li
                      key={item.name}
                      id={item.name}
                      onClick={(e) => goToSearchWithFilters(e.target, "category")}
                      className="homeWrapper__myProposals--link"
                    >
                      {item.name} ({item.count})
                    </li>
                  ))}
                </ul>
                <h3>{skillFacets.length > 0 ? "Skills" : ""}</h3>
                <ul>
                  {skillFacets.map((item) => (
                    <li
                      key={item.name}
                      id={item.name}
                      onClick={(e) => goToSearchWithFilters(e.target, "skill")}
                      className="homeWrapper__myProposals--link"
                    >
                      {item.name} ({item.count})
                    </li>
                  ))}
                </ul>
                <h3>{labelFacets.length > 0 ? "Labels" : ""}</h3>
                <ul>
                  {labelFacets.map((item) => (
                    <li
                      key={item.name}
                      id={item.name}
                      onClick={(e) => goToSearchWithFilters(e.target, "label")}
                      className="homeWrapper__myProposals--link"
                    >
                      {item.name} ({item.count})
                    </li>
                  ))}
                </ul>
              </div>
            </CardBox>
          </div>
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title="Popular">
                <Box component="form" autoComplete="off" noValidate>
                  <TextField
                    variant="outlined"
                    label="Search project"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button type="button" onClick={goToSearch}>
                    Search
                  </button>
                </Box>
                <div className="homeWrapper__popular">{projects.map(mapRenderProposals)}</div>
                <button disabled={page === 0} onClick={goToPreviousPage}>
                  Previous{" "}
                </button>
                <button disabled={!hasMore} onClick={goToNextPage}>
                  Next
                </button>
              </CardBox>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

const Wrapper = styled.div`
  margin-top: 35px;
  margin-bottom: 100px;
  max-width: 997px;
  margin-left: auto;
  margin-right: auto;
  .homeWrapper__navbar {
    background-color: #fff;
    height: 58px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 21px;
  }
  .homeWrapper__navbar__categories {
    display: flex;
    align-items: center;
    margin-left: 36px;
  }
  .homeWrapper__navbar__categories--title {
    color: #475f7b;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
  }
  .homeWrapper__navbar__categories--list {
    margin-left: 18px;
  }
  .homeWrapper__navbar__categories--list ul {
    list-style: none;
    display: flex;
  }
  .homeWrapper__navbar__categories--list ul li {
    color: #727e8c;
    font-family: Poppins;
    font-size: 15px;
    letter-spacing: 0;
    line-height: 21px;
    margin-right: 18px;
    font-weight: 300;
  }
  .homeWrapper__navbar__button {
    display: flex;
    align-items: center;
    margin-right: 49px;
  }
  .homeWrapper__navbar__button button {
    background-image: url(/add.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 15px 50%;
    border: none;
    color: #ffffff;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 600;
    width: 160px;
    letter-spacing: 0;
    line-height: 29px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #ff6f18;
    padding: 7px 7px 8px 41px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  }

  .homeWrapper--content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .homeWrapper__navbar {
  }
  .homeWrapper__information {
    width: 100%;
    max-width: 737px;
  }
  .homeWrapper__information--row {
    margin-bottom: 20px;
  }
  .homeWrapper__information--row:last-child {
    margin-bottom: 0px;
  }
  .homeWrapper__popular {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    row-gap: 35px;
    column-gap: 15px;
    margin-bottom: 35px;
  }
  .homeWrapper__myProposals {
    display: grid;
    row-gap: 35px;
    width: 100%;
    max-width: 250px;
    margin-right: 15px;
  }
  .homeWrapper__myProposals--link {
    cursor: pointer;
  }
`

ProjectsPage.authenticate = true
ProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProjectsPage
