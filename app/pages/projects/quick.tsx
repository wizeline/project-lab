import { Link, useRouter, useMutation, useSession, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import createProject from "app/projects/mutations/createProject"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"
import { InitialMembers, QuickCreate } from "app/projects/validations"

const QuickProjectPage: BlitzPage = () => {
  const router = useRouter()
  const session = useSession()
  const [createProjectMutation] = useMutation(createProject)

  return (
    <>
      <Header title="Quick proposal" />
      <div className="wrapper">
        <h1>Quick proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => router.push(Routes.NewProjectPage())} />
        <div className="formQuick">
          <Form
            submitText="Create Project"
            fullWidthButton
            initialValues={{
              // add current profile as default member
              projectMembers: InitialMembers(session.profileId),
            }}
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
          >
            <div className="formQuick--input">
              <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />
            </div>
            <div className="formQuick--input">
              <LabeledTextField
                fullWidth
                name="description"
                label="Problem statement"
                placeholder="How might we..."
              />
            </div>
            <div className="formQuick--input">
              <LabeledTextField
                fullWidth
                name="valueStatement"
                label="Your proposal"
                placeholder="Explain us your proposal"
              />
            </div>
            <ProjectMembersField name="projectMembers" label="Add a member" />
          </Form>
        </div>
      </div>
      <style jsx>{`
        .formQuick {
          width: 520px;
          margin: 0 auto;
        }
        .formQuick--input {
          margin: 15px 0px;
        }
      `}</style>
    </>
  )
}

QuickProjectPage.authenticate = true
QuickProjectPage.getLayout = (page) => <Layout title={"Quick proposal"}>{page}</Layout>

export default QuickProjectPage
