import { useState } from "react"
import { Link, useRouter, useMutation, useSession, BlitzPage, Routes, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { InitialMembers, FullCreate } from "app/projects/validations"
import Header from "app/core/layouts/Header"
import SidebarStep from "app/projects/components/SidebarStep"
import TheTheam from "app/projects/components/tabs/TheTeam"

import { WrapperContent, WrapperContentNav, WrapperContentForm } from "./full.styles"

const steps = [
  {
    step: 1,
    icon: "/bulb.png",
    text: "Proposal Title",
  },
  {
    step: 2,
    icon: "/description.png",
    text: "Description",
  },
  {
    step: 3,
    icon: "/team.png",
    text: "The team",
  },
]

const FullProjectPage: BlitzPage = () => {
  const session = useSession()
  const [step, setStep] = useState(1)
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)

  const onClick = (nextStep) => {
    setStep(nextStep)
  }

  const firstStep = () => {
    return (
      <>
        <ProjectForm
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
      </>
    )
  }

  const secondStep = () => {
    return <div>step 2</div>
  }

  const thirdStep = () => {
    return <TheTheam />
  }

  const renderSteps = (activeStep) => {
    switch (activeStep) {
      case 1:
        return firstStep()
      case 2:
        return secondStep()
      case 3:
        return thirdStep()
      default:
        return <div>Not step found</div>
    }
  }

  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1>Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => Router.push(Routes.NewProjectPage())} />
        <WrapperContent>
          <WrapperContentNav>
            <SidebarStep steps={steps} activeStep={step} onClick={onClick} />
          </WrapperContentNav>
          <WrapperContentForm>{renderSteps(step)}</WrapperContentForm>
        </WrapperContent>
      </div>
    </div>
  )
}

FullProjectPage.authenticate = true
FullProjectPage.getLayout = (page) => <Layout title={"Create new proposal"}>{page}</Layout>

export default FullProjectPage
