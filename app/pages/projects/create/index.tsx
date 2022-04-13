import { Suspense, useMemo, useState } from "react"
import { useRouter, useMutation, useSession, BlitzPage, Routes, Router } from "blitz"
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
  const [savingProject, setSavingProject] = useState<boolean>(false)

  const INIT_VAUES_PROJECTFORM = useMemo(() => {
    return {
      skills: [],
      labels: [],
      // add current profile as default member
      projectMembers: InitialMembers(session),
    }
  }, [session])

  const projectFormOnSubmit = async (values) => {
    setSavingProject(true)
    try {
      const project = await createProjectMutation(values)
      router.push(Routes.ShowProjectPage({ projectId: project.id }))
    } catch (error) {
      console.error(error)
      setSavingProject(false)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1 className="form__center-text">Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => Router.push(Routes.Home())} />
        <ProjectForm
          projectformType="create"
          submitText="Create Project"
          initialValues={INIT_VAUES_PROJECTFORM}
          schema={FullCreate}
          onSubmit={projectFormOnSubmit}
          disabled={savingProject}
        />
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
