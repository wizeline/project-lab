import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getLabels from "app/labels/queries/getLabels"

const ITEMS_PER_PAGE = 100

export const LabelsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ labels, hasMore }] = usePaginatedQuery(getLabels, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {labels.map((label) => (
          <li key={label.id}>
            <Link href={Routes.ShowLabelPage({ labelId: label.id })}>
              <a>{label.name}</a>
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

const LabelsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Labels</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewLabelPage()}>
            <a>Create Label</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <LabelsList />
        </Suspense>
      </div>
    </>
  )
}

LabelsPage.authenticate = true
LabelsPage.getLayout = (page) => <Layout>{page}</Layout>

export default LabelsPage
