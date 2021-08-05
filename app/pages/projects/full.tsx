import { useState } from "react"
import { Link, useRouter, useMutation, BlitzPage, Routes, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate } from "app/projects/validations"
import Header from "app/core/layouts/Header"
import SidebarStep from "app/projects/components/SidebarStep"

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
            projectMembers: [],
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
    return <div>step 3</div>
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

  const goBack = () => {
    Router.push(Routes.NewProjectPage())
  }

  return (
    <>
      <Header title="Create your proposal" />
      <div className="titleBar">
        <h1>Create your proposal</h1>
      </div>
      <div className="wrapper">
        <div className="wrapper__back">
          <div className="wrapper__back--icon" onClick={goBack} />
          <div className="wrapper__back--text">Back to main page</div>
        </div>
        <div className="wrapper__content">
          <div className="wrapper__content--nav">
            <SidebarStep steps={steps} activeStep={step} onClick={onClick} />
          </div>
          <div className="wrapper__content--form">{renderSteps(step)}</div>
        </div>
      </div>
      <style jsx>{`
        .titleBar {
          background-color: #fff;
          border-radius: 7px;
          display: flex;
          margin-bottom: 15px;
          width: 100%;
          max-width: 951px;
          margin-top: 67px;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
          padding: 25px 38px;
        }
        h1 {
          color: #252a2f;
          font-family: Poppins;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 30px;
        }
        .wrapper {
          width: 100%;
          max-width: 951px;
          border-radius: 7px;
          background-color: #ffffff;
          margin-top: 15px;
          margin-left: auto;
          margin-right: auto;
          padding: 20px 23px;
          box-sizing: border-box;
        }
        .wrapper__back {
          margin-left: 12px;
          display: flex;
          height: 51px;
          margin-bottom: 67px;
        }
        .wrapper__back--icon {
          width: 23px;
          height: 23px;
          background-size: contain;
          background-image: url(/arrow-back.png);
          cursor: pointer;
        }
        .wrapper__back--text {
          color: #475f7b;
          font-family: Poppins;
          font-size: 18px;
          letter-spacing: 0;
          line-height: 27px;
          margin-left: 14px;
        }
        .wrapper__content {
          display: flex;
          flex-direction: row;
        }
        .wrapper__content--nav {
          width: 210px;
        }
        .wrapper__content--form {
          margin-left: 45px;
          width: 100%;
          max-width: 540px;
        }
      `}</style>
    </>
  )
}

FullProjectPage.authenticate = true
FullProjectPage.getLayout = (page) => <Layout title={"Create new proposal"}>{page}</Layout>

export default FullProjectPage
