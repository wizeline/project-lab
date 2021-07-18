import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { QuickCreate } from "app/projects/validations"

const FullProjectPage: BlitzPage = () => {
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)

  return (
    <div>
      <h1>Create your proposal</h1>

      <ProjectForm
        submitText="Create Project"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // initialValues={{}}
        schema={QuickCreate}
        onSubmit={async (values) => {
          try {
            const project = await createProjectMutation(values)
            router.push(Routes.ShowProjectPage({ projectId: project.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>
    </div>
  )
}

FullProjectPage.authenticate = true
FullProjectPage.getLayout = (page) => <Layout title={"Create new proposal"}>{page}</Layout>

export default FullProjectPage
