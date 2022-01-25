import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getLabel from "app/labels/queries/getLabel"
import updateLabel from "app/labels/mutations/updateLabel"
import { LabelForm, FORM_ERROR } from "app/labels/components/LabelForm"

export const EditLabel = () => {
  const router = useRouter()
  const labelId = useParam("labelId", "number")
  const [label, { setQueryData }] = useQuery(
    getLabel,
    { id: labelId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateLabelMutation] = useMutation(updateLabel)

  return (
    <>
      <Head>
        <title>Edit Label {label.id}</title>
      </Head>

      <div>
        <h1>Edit Label {label.id}</h1>
        <pre>{JSON.stringify(label, null, 2)}</pre>

        <LabelForm
          submitText="Update Label"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateLabel}
          initialValues={label}
          onSubmit={async (values) => {
            try {
              const updated = await updateLabelMutation({
                id: label.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowLabelPage({ labelId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditLabelPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditLabel />
      </Suspense>

      <p>
        <Link href={Routes.LabelsPage()}>
          <a>Labels</a>
        </Link>
      </p>
    </div>
  )
}

EditLabelPage.authenticate = true
EditLabelPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditLabelPage
