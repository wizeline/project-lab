import { usePaginatedQuery, useRouter, Router, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/projects/queries/getProjects"
import getMyProjects from "app/projects/queries/getMyProjects"
import CardBox from "app/core/components/CardBox"
import ProposalCard from "app/core/components/ProposalCard"
import Header from "app/core/layouts/Header"

import { Wrapper } from "./projects.styles"

const ITEMS_PER_PAGE = 4
const MY_ITEMS_MAX = 10

const ProjectsPage: BlitzPage = () => {
  //functions to load and paginate projects in `Popular` CardBox
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  //function to load projects in `My proposals` CardBox
  const [{ projects: myProjects }] = usePaginatedQuery(getMyProjects, {
    orderBy: { id: "asc" },
    take: MY_ITEMS_MAX,
  })

  //function to render projects in a Proposals CardBox
  const mapRenderProposals = (item, i) => {
    return (
      <ProposalCard
        id={item.id}
        title={item.name}
        date={new Intl.DateTimeFormat([], {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(item.createdAt)}
        description={item.description}
        status={item.status}
        color={item.projectStatus.color}
        votesCount={item.votesCount}
      />
    )
  }
  // Direct link to full project page
  const goToCreateNewProposal = () => {
    Router.push(Routes.FullProjectPage())
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
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title="Popular">
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
          <div className="homeWrapper__myProposals">
            <CardBox title="My proposals">
              <div className="homeWrapper__myProposals">{myProjects.map(mapRenderProposals)}</div>
            </CardBox>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

ProjectsPage.authenticate = true
ProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProjectsPage
