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
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import CloseIcon from "@mui/icons-material/Close"
import { SortInput } from "app/core/components/SortInput"

type SearchFilters = {
  status: string[]
  category: string[]
  skill: string[]
  label: string[]
  projectStatus: string[]
}

type queryItems = {
  page?: number
  q?: string
  status?: string
  category?: string
  skill?: string
  label?: string
  projectStatus?: string
  count?: number
}

type wrapperProps = {
  filtersOpen: boolean
}

const ITEMS_PER_PAGE = 4

const Wrapper = styled.div<wrapperProps>`
  position: relative;
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
    display: flex;
    align-items: flex-start;
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

  .homeWrapper__information {
    width: 100%;
    max-width: 737px;
  }
  .homeWrapper__information--row {
    margin-bottom: 20px;
    width: 100%;
  }
  .homeWrapper__information--row:last-child {
    margin-bottom: 0px;
  }
  .homeWrapper__popular {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    row-gap: 35px;
    column-gap: 15px;
    margin-bottom: 35px;
    align-items: center;
    justify-items: center;
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

  .homeWrapper__pagination-buttons {
    display: flex;
  }

  .homeWrapper__mobile-filters {
    display: none;
  }

  .filter__mobile-close-button {
    display: none;
  }

  .filter__mobile-button {
    display: none;
  }

  @media (max-width: 1025px) {
    margin-top: 10px;

    .homeWrapper__navbar {
      justify-content: center;
      margin-bottom: 10px;
    }

    .homeWrapper__navbar__tabs {
      margin-left: 0px;
    }

    .homeWrapper__myProposals {
      position: absolute;
      left: ${(props) => (props.filtersOpen ? "0" : "-24rem")};
      z-index: 99;
      transition: all 0.3s ease-in-out;
      top: 68px;
      border-radius: 7px;
      box-shadow: 10px 10px 24px 1px rgba(0, 0, 0, 0.1), 10px -10px 32px 1px rgba(0, 0, 0, 0.1);
    }
    .homeWrapper__popular {
    }
    .homeWrapper__navbar__sort {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .homeWrapper__pagination-buttons {
      justify-content: center;
    }

    .homeWrapper__mobile-filters {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
    }

    .homeWrapper__information {
      max-width: 100%;
    }

    .filter__mobile-button {
      display: block;
      position: relative;
      border: none;
      color: #ffffff;
      font-family: Poppins;
      font-size: 13px;
      font-weight: 600;
      width: 100px;
      letter-spacing: 0;
      line-height: 27px;
      cursor: pointer;
      border-radius: 4px;
      background-color: #e94d44;
      padding: 4px 15px 4px 4px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
      margin-left: 20px;
    }

    .filter__mobile-close-button {
      display: block;
      position: absolute;
      top: 25px;
      right: 5%;
    }
  }
  @media (max-width: 480px) {
    .homeWrapper__navbar__sort {
      justify-content: space-around;
    }
  }
`

export const Projects = () => {
  //functions to load and paginate projects in `Popular` CardBox
  const router = useRouter()
  const qParams = useRouterQuery()
  const page = Number(router.query.page) || 0
  const search = router.query.q || ""
  const { status, category, skill, label, projectStatus }: queryItems = router.query
  const [isFirstLoading, setIsFirstLoading] = useState(true)
  const [chips, setChips] = useState<string[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    status: status ? [status] : [],
    category: category ? [category] : [],
    skill: skill ? [skill] : [],
    label: label ? [label] : [],
    projectStatus: projectStatus ? [projectStatus] : [],
  })

  useEffect(() => {
    setChips(Object.values(filters).flat())
  }, [filters])

  //sorting variables
  const [sortQuery, setSortQuery] = useState({ field: "name", order: "desc" })

  let [
    {
      projects,
      hasMore,
      statusFacets,
      categoryFacets,
      skillFacets,
      labelFacets,
      projectFacets,
      count,
    },
  ] = useQuery(searchProjects, {
    search,
    category,
    status,
    skill,
    label,
    projectStatus,
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

      queryParams[filter] = searchParam
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
      status: status ? [status] : [],
      category: category ? [category] : [],
      skill: skill ? [skill] : [],
      label: label ? [label] : [],
      projectStatus: projectStatus ? [projectStatus] : [],
    })
  }, [router.query.q, status, category, skill, label, projectStatus])

  useEffect(() => {
    if (isFirstLoading) {
      const queryParams = JSON.parse(JSON.stringify(qParams))
      let params = queryParams["projectStatus"] === undefined ? { projectStatus: "Active" } : null
      Router.push({
        pathname: "/projects/search",
        query: { ...queryParams, ...params },
      })
      setIsFirstLoading(false)
    }
  }, [qParams, isFirstLoading])
  const handleTabChange = (selectedTab: string) => {
    selectedTab === "allResults"
      ? setTab({ allResults: "homeWrapper__navbar__tabs--title--selected", myProposals: "" })
      : setTab({ allResults: "", myProposals: "homeWrapper__navbar__tabs--title--selected" })
    handleTabChangeSearch(selectedTab)
  }

  const handleTabChangeSearch = (selectedTab: string) => {
    selectedTab === "allResults"
      ? router.push({ pathname: "/projects/search", query: { projectStatus: "Active" } })
      : router.push({
          pathname: "/projects/search",
          query: { q: "myProposals", projectStatus: "Active" },
        })
  }

  //Mobile Filters logic
  const [openMobileFilters, setOpenMobileFilters] = useState(false)
  const handleMobileFilters = () => {
    setOpenMobileFilters(!openMobileFilters)
  }

  return (
    <>
      <Header title="Projects" />
      <Wrapper className="homeWrapper" filtersOpen={openMobileFilters}>
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
              <div>
                <CloseIcon
                  fontSize="large"
                  className="filter__mobile-close-button"
                  onClick={handleMobileFilters}
                />
                <Accordion defaultExpanded disableGutters className="homeWrapper__accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-controls"
                    id="panel1a-header"
                  >
                    <h3>{statusFacets.length > 0 ? "Status" : ""}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul className="homeWrapper__myProposals--list">
                      {projectFacets.map((item) => (
                        <li key={item.Status ? "Archived" : "Active"}>
                          <Link
                            id={item.Status ? "Archived" : "Active"}
                            underline="none"
                            href=""
                            color="#AF2E33"
                            onClick={(e) => goToSearchWithFilters(e, "projectStatus")}
                          >
                            {item.Status ? "Archived" : "Active"} ({item.count})
                          </Link>
                        </li>
                      ))}
                      {statusFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            underline="none"
                            href=""
                            color="#AF2E33"
                            onClick={(e) => goToSearchWithFilters(e, "status")}
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
              <CardBox title={tab.allResults ? `All Results (${count || 0})` : "My Proposals"}>
                <div className="homeWrapper__navbar__sort">
                  <SortInput setSortQuery={setSortQuery} />
                  <button className="filter__mobile-button" onClick={handleMobileFilters}>
                    Filters
                    <FilterAltIcon sx={{ fontSize: "17px", position: "absolute", top: "20%" }} />
                  </button>
                </div>
                <div className="homeWrapper__popular">{projects.map(mapRenderProposals)}</div>
                <div className="homeWrapper__pagination-buttons">
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
                </div>
              </CardBox>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

const SearchProjectsPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Projects />
      </Suspense>
    </>
  )
}

SearchProjectsPage.authenticate = true
SearchProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default SearchProjectsPage
