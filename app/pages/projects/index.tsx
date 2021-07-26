import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/projects/queries/getProjects"
import CardBox from "app/core/components/CardBox"
import ProposalCard from "app/core/components/ProposalCard"
import { popularHomeProposals, newForYouHome, myProposals } from "app/core/utils/mock_data"

const ITEMS_PER_PAGE = 100

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
  const mapRenderProposals = (item, i) => {
    return (
      <ProposalCard
        key={i}
        title={item.title}
        date={item.date}
        description={item.description}
        status={item.status}
        votes={item.votes}
      />
    )
  }

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <div>
        <p>
          <Link href={Routes.NewProjectPage()}>
            <a>Create Project</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ProjectsList />
        </Suspense>
      </div>
      <div className="homeWrapper">
        <div className="homeWrapper__navbar" />
        <div className="homeWrapper--content">
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title="Popular">
                <div className="homeWrapper__items">
                  {popularHomeProposals.map(mapRenderProposals)}
                </div>
              </CardBox>
            </div>
            <div className="homeWrapper__information--row">
              <CardBox title="New for you">
                <div className="homeWrapper__items">
                  {popularHomeProposals.map(mapRenderProposals)}
                </div>
              </CardBox>
            </div>
          </div>
          <div className="homeWrapper__proposals">
            <CardBox title="My proposals">{myProposals.map(mapRenderProposals)}</CardBox>
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
