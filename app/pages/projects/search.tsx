import { Suspense, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useQuery, useRouter, useRouterQuery, Router, BlitzPage, Routes, useSession } from "blitz"
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
import Wrapper from "./projects.styles"

type SearchFilters = {
  status: string[]
  skill: string[]
  label: string[]
  projectStatus: string[]
  discipline: string[]
  tier: string[]
  location: string[]
}

type queryItems = {
  page?: number
  q?: string
  status?: string
  skill?: string
  label?: string
  discipline?: string
  projectStatus?: string
  tier?: string
  location?: string
  count?: number
}

const ITEMS_PER_PAGE = 50

export const Projects = () => {
  //functions to load and paginate projects in `Popular` CardBox
  const router = useRouter()
  const user = useSession()
  const qParams = useRouterQuery()
  const page = Number(router.query.page) || 0
  const search = router.query.q || ""
  const { status, skill, label, projectStatus, discipline, location, tier }: queryItems =
    router.query
  const [chips, setChips] = useState<string[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    status: status ? [status] : [],
    skill: skill ? [skill] : [],
    label: label ? [label] : [],
    discipline: discipline ? [discipline] : [],
    projectStatus: projectStatus ? [projectStatus] : [],
    tier: tier ? [tier] : [],
    location: location ? [location] : [],
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
      skillFacets,
      disciplineFacets,
      labelFacets,
      projectFacets,
      tierFacets,
      locationsFacets,
      count,
    },
  ] = useQuery(searchProjects, {
    search,
    status,
    skill,
    label,
    projectStatus,
    discipline,
    tier,
    location,
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
        isOwner={item.ownerId === user.profileId}
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
    let chipsComponent = <></>

    if (chips.length > 0) {
      chipsComponent = (
        <div>
          <div className="filter__title">Selected Filters</div>
          <>
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
          </>
        </div>
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
      skill: skill ? [skill] : [],
      label: label ? [label] : [],
      discipline: discipline ? [discipline] : [],
      projectStatus: projectStatus ? [projectStatus] : [],
      tier: tier ? [tier] : [],
      location: location ? [location] : [],
    })
  }, [router.query.q, status, skill, label, discipline, projectStatus, tier, location])

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
              My Projects
            </div>
          </div>
        </div>
        <div className="homeWrapper--content">
          <div className="homeWrapper__myProposals">
            <CardBox className="filter__box" bodyClassName="filter__content__card">
              <div>
                <CloseIcon
                  fontSize="large"
                  className="filter__mobile-close-button"
                  onClick={handleMobileFilters}
                />
                {makeChips()}
                <div className="filter__title">Filters</div>
                {statusFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-controls"
                      id="panel1a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Status</h4>
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
                )}
                {skillFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Skills</h4>
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
                )}
                {disciplineFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Looking for</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
                        {disciplineFacets.map((item) => (
                          <li key={item.name}>
                            <Link
                              id={item.name}
                              underline="none"
                              href=""
                              color="#AF2E33"
                              onClick={(e) => goToSearchWithFilters(e, "discipline")}
                            >
                              {item.name} ({item.count})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                )}
                {labelFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Labels</h4>
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
                )}
                {tierFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Innovation tiers</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
                        {tierFacets.map((item) => (
                          <li key={item.name}>
                            <Link
                              id={item.name}
                              underline="none"
                              href=""
                              color="#AF2E33"
                              onClick={(e) => goToSearchWithFilters(e, "tier")}
                            >
                              {item.name} ({item.count})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                )}
                {locationsFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Locations</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
                        {locationsFacets.map((item) => (
                          <li key={item.name}>
                            <Link
                              id={item.name}
                              underline="none"
                              href=""
                              color="#AF2E33"
                              onClick={(e) => goToSearchWithFilters(e, "location")}
                            >
                              {item.name} ({item.count})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                )}
              </div>
            </CardBox>
          </div>
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title={tab.allResults ? `All Results (${count || 0})` : "My Projects"}>
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
                    Previous
                  </button>
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
