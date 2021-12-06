import { Suspense } from "react"
import {
  Link,
  useRouter,
  useMutation,
  useSession,
  BlitzPage,
  Routes,
  Router,
  getAntiCSRFToken,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Loader from "app/core/components/Loader"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { InitialMembers, FullCreate } from "app/projects/validations"
import Header from "app/core/layouts/Header"

export const NewProject = () => {
  const session = useSession()
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  const antiCSRFToken = getAntiCSRFToken()
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
              fetch("/api/slackEvents", {
                credentials: "include",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "anti-csrf": antiCSRFToken,
                },
                body: JSON.stringify({
                  type: "slack_notification",
                  id: project.id,
                  name: project.name,
                  description: project.description,
                  status: project.status,
                  votes: project.votesCount,
                }),
              })
                .then(() => console.log("Slack notification sent!"))
                .catch((e) => console.error("Something went worng!", e.message))
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

const NewProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <NewProject />
      </Suspense>
    </div>
  )
}

NewProjectPage.authenticate = true
NewProjectPage.getLayout = (page) => <Layout title={"Create new proposal"}>{page}</Layout>

export default NewProjectPage
