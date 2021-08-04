import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, Router, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/projects/queries/getProjects"
import getMyProjects from "app/projects/queries/getMyProjects"
import CardBox from "app/core/components/CardBox"
import ProposalCard from "app/core/components/ProposalCard"
import { newForYouHome } from "app/core/utils/mock_data"

import Header from "app/core/layouts/Header"

const ITEMS_PER_PAGE = 4
const MY_ITEMS_MAX = 10

//Component to render an unformated list of projects **deprecate code**
export const ProjectsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={Routes.ShowProjectPage({ projectId: project.id })}>
              <a>{project.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

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
        key={i}
        title={item.name}
        date={new Intl.DateTimeFormat([], {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(item.createdAt)}
        description={item.description}
        status={item.status}
        votes={1000}
      />
    )
  }

  const goToCreateNewProposal = () => {
    Router.push(Routes.NewProjectPage())
  }

  return (
    <>
      <Header title="Projects" />
      {/*
          <div>
            <p>
              <Link >
                <a>Create Project</a>
              </Link>
            </p>

            <Suspense fallback={<div>Loading...</div>}>
              <ProjectsList />
            </Suspense>
          </div>
        */}
      <div className="homeWrapper">
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
                <div className="homeWrapper__items">{projects.map(mapRenderProposals)}</div>
                <button disabled={page === 0} onClick={goToPreviousPage}>
                  Previous{" "}
                </button>
                <button disabled={!hasMore} onClick={goToNextPage}>
                  Next
                </button>
              </CardBox>
            </div>
            <div className="homeWrapper__information--row">
              <CardBox title="New for you">
                <div className="homeWrapper__items">{newForYouHome.map(mapRenderProposals)}</div>
              </CardBox>
            </div>
          </div>
          <div className="homeWrapper__proposals">
            <CardBox title="My proposals">{myProjects.map(mapRenderProposals)}</CardBox>
          </div>
        </div>
      </div>
      <style jsx>{`
        .homeWrapper {
          margin-top: 35px;
          margin-bottom: 100px;
          max-width: 960px;
          margin-left: auto;
          margin-right: auto;
        }
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
          max-width: 560px;
        }
        .homeWrapper__information--row {
          margin-bottom: 20px;
        }
        .homeWrapper__information--row:last-child {
          margin-bottom: 0px;
        }
        .homeWrapper__items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          row-gap: 35px;
          column-gap: 15px;
          margin-bottom: 35px;
        }
        .homeWrapper__proposals {
          width: 100%;
          max-width: 390px;
          margin-left: 15px;
        }
      `}</style>
    </>
  )
}

ProjectsPage.authenticate = true
ProjectsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProjectsPage
