import { Suspense } from "react"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Router, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate } from "app/projects/validations"

export const EditProject = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "string")
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateProjectMutation] = useMutation(updateProject)

  return (
    <>
      <Header title={"Edit " + project.name} />

      <div className="wrapper">
        <h1>Edit {project.name}</h1>
      </div>
      <div className="wrapper">
        <GoBack
          title="Back to project"
          onClick={() => Router.push(Routes.ShowProjectPage({ projectId: project.id }))}
        />
        <ProjectForm
          submitText="Update Project"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={FullCreate}
          initialValues={project}
          onSubmit={async (values) => {
            try {
              const updated = await updateProjectMutation({
                id: project.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowProjectPage({ projectId: updated.id }))
            } catch (error) {
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

const EditProjectPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>

      <p>
        <Link href={Routes.ProjectsPage()}>
          <a>Projects</a>
        </Link>
      </p>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
