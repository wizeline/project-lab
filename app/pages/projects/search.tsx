import { Suspense, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useQuery, useRouter, useRouterQuery, Router, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import Loader from "app/core/components/Loader"
import searchProjects from "app/projects/queries/searchProjects"
import CardBox from "app/core/components/CardBox"
import ProposalCard from "app/core/components/ProposalCard"
import Header from "app/core/layouts/Header"
import { Accordion, AccordionDetails, AccordionSummary, Link, Chip } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { SortInput } from "app/core/components/SortInput"

type SearchFilters = {
  category: string[]
  skill: string[]
  label: string[]
}

type queryItems = {
  page?: number
  q?: string
  category?: string
  skill?: string
  label?: string
}

const ITEMS_PER_PAGE = 4

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
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 21px;
  }
  .homeWrapper__navbar__sort {
    margin-bottom: 20px;
  }
  .homeWrapper__navbar__tabs {
    display: flex;
    margin-left: 20px;
  }
  .homeWrapper__navbar__tabs--title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 10px;
    cursor: pointer;

    :hover {
      color: #e94d44;
    }
  }
  .homeWrapper__navbar__tabs--title--selected {
    color: #e94d44;
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
    background-color: #e94d44;
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
    row-gap: 2px;
    width: 100%;
    max-width: 250px;
    margin-right: 15px;
  }
  .homeWrapper__myProposals--filters {
    margin: 0 4px 2px 0;
  }
  .homeWrapper__myProposals--list {
    list-style-type: none;
  }
  .homeWrapper__accordion {
    box-shadow: none;
  }
  .pageButton {
    margin-right: 10px;
  }
`

export const Projects = () => {
  //functions to load and paginate projects in `Popular` CardBox
  const router = useRouter()
  const qParams = useRouterQuery()
  const page = Number(router.query.page) || 0
  const search = router.query.q || ""
  const { category, skill, label }: queryItems = router.query
  const [chips, setChips] = useState<string[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    category: category ? [category] : [],
    skill: skill ? [skill] : [],
    label: label ? [label] : [],
  })

  useEffect(() => {
    setChips(Object.values(filters).flat())
  }, [filters])

  //sorting variables
  const [sortQuery, setSortQuery] = useState({ field: "name", order: "desc" })

  let [{ projects, hasMore, categoryFacets, skillFacets, labelFacets }] = useQuery(searchProjects, {
    search,
    category,
    skill,
    label,
    orderBy: { ...sortQuery },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { ...router.query, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { ...router.query, page: page + 1 } })

  const initials = (firstName, lastName) => {
    return firstName.substring(0, 1) + lastName.substring(0, 1)
  }

  //function to render projects in a Proposals CardBox
  const mapRenderProposals = (item, i) => {
    return (
      <ProposalCard
        key={i}
        id={item.id}
        title={item.name}
        picture={item.avatarUrl}
        initials={initials(item.firstName, item.lastName)}
        date={new Intl.DateTimeFormat([], {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(new Date(item.createdAt))}
        description={item.description}
        status={item.status}
        color={item.color}
        votesCount={item.votesCount}
        skills={
          item.searchSkills && item.searchSkills.split(",").map((skill) => ({ name: skill.trim() }))
        }
      />
    )
  }

  const goToSearchWithFilters = (event: Event, filter: string) => {
    event.preventDefault()

    const queryParams = JSON.parse(JSON.stringify(qParams))
    const searchParam = event.target && event.target["id"]
    const index = filters[filter].findIndex((item) => searchParam === item)

    if (index === -1) {
      const updatedFilters = [...filters[filter], searchParam]

      setFilters({ ...filters, [filter]: updatedFilters })
      setChips([...chips, searchParam])

      queryParams[filter] = !queryParams[filter]
        ? searchParam
        : [...queryParams[filter], searchParam]
    }

    Router.push({
      pathname: "/projects/search",
      query: queryParams,
    })
  }

  const deleteFilter = (filter: string) => {
    const chipsIndex = chips.findIndex((value) => filter === value)
    const queryParams = JSON.parse(JSON.stringify(qParams))

    Object.keys(filters).forEach((type) => {
      const index = filters[type].findIndex((value) => filter === value)

      if (index >= 0) {
        filters[type].splice(index, 1)
      }
    })
    setFilters({ ...filters })

    if (chipsIndex >= 0) {
      chips.splice(chipsIndex, 1)
      setChips([...chips])
    }

    Object.keys(queryParams).forEach((type) => {
      if (typeof queryParams[type] === "string" && queryParams[type] === filter) {
        delete queryParams[type]
      } else if (Array.isArray(queryParams[type])) {
        const index = queryParams[type].findIndex((value) => filter === value)
        queryParams[type].splice(index, 1)
      }
    })

    Router.push({
      pathname: "/projects/search",
      query: queryParams,
    })
  }

  const makeChips = () => {
    let chipsComponent = (
      <>
        <span></span>
      </>
    )

    if (chips.length > 0) {
      chipsComponent = (
        <CardBox title="Selected Filters">
          {chips.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              size="small"
              variant="outlined"
              className="homeWrapper__myProposals--filters"
              onDelete={() => deleteFilter(filter)}
            />
          ))}
        </CardBox>
      )
    }

    return chipsComponent
  }

  //Tabs selection logic
  const [tab, setTab] = useState({
    allResults: "homeWrapper__navbar__tabs--title--selected",
    myProposals: "",
  })

  useEffect(() => {
    if (router.query.q === "myProposals") {
      setTab({
        allResults: "",
        myProposals: "homeWrapper__navbar__tabs--title--selected",
      })
    } else {
      setTab({
        allResults: "homeWrapper__navbar__tabs--title--selected",
        myProposals: "",
      })
    }
    setFilters({
      category: category ? [category] : [],
      skill: skill ? [skill] : [],
      label: label ? [label] : [],
    })
  }, [router.query.q, category, skill, label])

  const handleTabChange = (selectedTab: string) => {
    selectedTab === "allResults"
      ? setTab({ allResults: "homeWrapper__navbar__tabs--title--selected", myProposals: "" })
      : setTab({ allResults: "", myProposals: "homeWrapper__navbar__tabs--title--selected" })

    handleTabChangeSearch(selectedTab)
  }

  const handleTabChangeSearch = (selectedTab: string) => {
    selectedTab === "allResults"
      ? router.push({ pathname: "/projects/search", query: "" })
      : router.push({ pathname: "/projects/search", query: { q: "myProposals" } })
  }

  return (
    <div>
      <Header title="Projects" />
      <Wrapper className="homeWrapper">
        <div className="homeWrapper__navbar">
          <div className="homeWrapper__navbar__tabs">
            <div
              className={`homeWrapper__navbar__tabs--title ${tab.allResults}`}
              onClick={() => handleTabChange("allResults")}
            >
              All Results
            </div>
            <div
              className={`homeWrapper__navbar__tabs--title ${tab.myProposals}`}
              onClick={() => handleTabChange("myProposals")}
            >
              My proposals
            </div>
          </div>
        </div>
        <div className="homeWrapper--content">
          <div className="homeWrapper__myProposals">
            {makeChips()}
            <CardBox title="Filters">
              <div className="homeWrapper__myProposals">
                <Accordion defaultExpanded disableGutters className="homeWrapper__accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-controls"
                    id="panel1a-header"
                  >
                    <h3>{categoryFacets.length > 0 ? "Categories" : ""}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="homeWrapper__myProposals--list">
                      {categoryFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            underline="none"
                            href=""
                            color="#AF2E33"
                            onClick={(e) => goToSearchWithFilters(e, "category")}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded disableGutters className="homeWrapper__accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <h3>{skillFacets.length > 0 ? "Skills" : ""}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="homeWrapper__myProposals--list">
                      {skillFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            underline="none"
                            href=""
                            color="#AF2E33"
                            onClick={(e) => goToSearchWithFilters(e, "skill")}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded disableGutters className="homeWrapper__accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3a-controls"
                    id="panel3a-header"
                  >
                    <h3>{labelFacets.length > 0 ? "Labels" : ""}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="homeWrapper__myProposals--list">
                      {labelFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            underline="none"
                            href=""
                            color="#AF2E33"
                            onClick={(e) => goToSearchWithFilters(e, "label")}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </div>
            </CardBox>
          </div>
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title={tab.allResults ? "All Results" : "My Proposals"}>
                <div className="homeWrapper__navbar__sort">
                  <SortInput setSortQuery={setSortQuery} />
                </div>
                <div className="homeWrapper__popular">{projects.map(mapRenderProposals)}</div>
                <button
                  type="button"
                  disabled={page === 0}
                  className={page == 0 ? "primary default pageButton" : "primary pageButton"}
                  onClick={goToPreviousPage}
                >
                  Previous{" "}
                </button>{" "}
                <button
                  type="button"
                  disabled={!hasMore}
                  className={!hasMore ? "primary default pageButton" : "primary pageButton"}
                  onClick={goToNextPage}
                >
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

const SearchProjectsPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Projects />
      </Suspense>
    </div>
  )
}

SearchProjectsPage.authenticate = true
SearchProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default SearchProjectsPage
