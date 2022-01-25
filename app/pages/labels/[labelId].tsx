import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getLabel from "app/labels/queries/getLabel"
import deleteLabel from "app/labels/mutations/deleteLabel"

export const Label = () => {
  const router = useRouter()
  const labelId = useParam("labelId", "number")
  const [deleteLabelMutation] = useMutation(deleteLabel)
  const [label] = useQuery(getLabel, { id: labelId })

  return (
    <>
      <Head>
        <title>Label {label.id}</title>
      </Head>

      <div>
        <h1>Label {label.id}</h1>
        <pre>{JSON.stringify(label, null, 2)}</pre>

        <Link href={Routes.EditLabelPage({ labelId: label.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteLabelMutation({ id: label.id })
              router.push(Routes.LabelsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowLabelPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.LabelsPage()}>
          <a>Labels</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Label />
      </Suspense>
    </div>
  )
}

ShowLabelPage.authenticate = true
ShowLabelPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowLabelPage
