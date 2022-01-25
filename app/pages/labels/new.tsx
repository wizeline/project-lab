import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createLabel from "app/labels/mutations/createLabel"
import { LabelForm, FORM_ERROR } from "app/labels/components/LabelForm"

const NewLabelPage: BlitzPage = () => {
  const router = useRouter()
  const [createLabelMutation] = useMutation(createLabel)

  return (
    <div>
      <h1>Create New Label</h1>

      <LabelForm
        submitText="Create Label"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateLabel}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const label = await createLabelMutation(values)
            router.push(Routes.ShowLabelPage({ labelId: label.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.LabelsPage()}>
          <a>Labels</a>
        </Link>
      </p>
    </div>
  )
}

NewLabelPage.authenticate = true
NewLabelPage.getLayout = (page) => <Layout title={"Create New Label"}>{page}</Layout>

export default NewLabelPage
