import { Link, useRouter, useMutation, useSession, BlitzPage, Routes, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { InitialMembers, FullCreate } from "app/projects/validations"
import Header from "app/core/layouts/Header"

const NewProjectPage: BlitzPage = () => {
  const session = useSession()
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1>Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => Router.push(Routes.ProjectsPage())} />
        <ProjectForm
          projectformType="create"
          submitText="Create Project"
          initialValues={{
            skills: [],
            labels: [],
            // add current profile as default member
            projectMembers: InitialMembers(session.profileId),
          }}
          schema={FullCreate}
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
    </div>
  )
}

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create new proposal"}>{page}</Layout>

export default NewProjectPage
