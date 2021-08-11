import { useState } from "react"
import { Link, useRouter, useMutation, useSession, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import styled from "@emotion/styled"
import createProject from "app/projects/mutations/createProject"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"
import { InitialMembers, QuickCreate } from "app/projects/validations"
import { Dialog } from "@material-ui/core"
import Title from "app/projects/components/Title"

const QuickProjectPage: BlitzPage = () => {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [projectIdGenerated, setProjectIdGenerated] = useState<string>("")

  const router = useRouter()
  const session = useSession()
  const [createProjectMutation] = useMutation(createProject)

  const goToProjectDetail = () => {
    router.push(Routes.ShowProjectPage({ projectId: projectIdGenerated }))
  }

  return (
    <>
      <Header title="Quick proposal" />
      <div className="wrapper">
        <h1>Quick proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => router.push(Routes.NewProjectPage())} />
        <FormQuickWrap>
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
                setShowSuccessModal(true)
                setProjectIdGenerated(project.id)
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          >
            <FormQuickInput>
              <LabeledTextField name="name" label="Name" placeholder="Name" />
            </FormQuickInput>
            <FormQuickInput>
              <LabeledTextField
                name="description"
                label="Problem statement"
                placeholder="How might we..."
              />
            </FormQuickInput>
            <FormQuickInput>
              <LabeledTextField
                name="valueStatement"
                label="Your proposal"
                placeholder="Explain us your proposal"
              />
            </FormQuickInput>
            <ProjectMembersField name="projectMembers" label="Add a member" />
          </Form>
        </FormQuickWrap>
      </div>
      <Dialog open={showSuccessModal}>
        <WrapperDialog>
          <Title>We already published your idea!</Title>
          <Button onClick={goToProjectDetail}>Take me there!</Button>
        </WrapperDialog>
      </Dialog>
    </>
  )
}

const FormQuickWrap = styled.div`
  width: 520px;
  margin: 0 auto;
}
`

const FormQuickInput = styled.div`
  margin: 15px 0px;
}
`

const WrapperDialog = styled.div`
  display: flex;
  padding: 48px 98px 20px;
  flex-direction: column;
}
`

const Button = styled.button`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  border: none;
  background-color: #ff6f18;
  color: #ffffff;
  margin-top: 42px;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 29px;
  padding: 7px;
  width: 160px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  user-select: none;
  cursor: pointer;
`

QuickProjectPage.authenticate = true
QuickProjectPage.getLayout = (page) => <Layout title={"Quick proposal"}>{page}</Layout>

export default QuickProjectPage
