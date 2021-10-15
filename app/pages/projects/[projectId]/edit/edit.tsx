import { Suspense, useState } from "react"
import { useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import ModalBox from "app/core/components/ModalBox"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import deleteProject from "app/projects/mutations/deleteProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate } from "app/projects/validations"
import { TextField } from "@material-ui/core"

export const DeleteButton = (props) => {
  const [open, setOpen] = useState(false)
  const [deleteBtn, setDeleteBtn] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteProposal = async () => {
    await props.deleteProjectMutation({ id: props.project.id })
    props.router.push(Routes.ProjectsPage())
  }

  const projectName = (e) => {
    const value = e.target.value != props.project.name
    setDeleteBtn(value)
    setHasError(value)
  }

  return (
    <>
      <button type="button" className="primary warning" onClick={handleOpen}>
        Delete
      </button>

      <ModalBox open={open} handleClose={handleClose} height={243}>
        <h2>Are you sure you want to delete this proposal?</h2>
        <p>This action cannot be undo.</p>
        <br />
        <TextField
          label={`Type ${props.project.name}`}
          type="text"
          error={hasError}
          style={{ width: "100%" }}
          onChange={projectName}
        />
        <br />
        <br />
        <button
          type="button"
          className="primary warning"
          disabled={deleteBtn}
          onClick={deleteProposal}
        >
          Delete
        </button>
      </ModalBox>
    </>
  )
}

export const EditProject = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "string")
  const [deleteProjectMutation] = useMutation(deleteProject)
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
          onClick={() => router.push(Routes.ShowProjectPage({ projectId: project.id }))}
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
      <div className="wrapper">
        <DeleteButton
          project={project}
          deleteProjectMutation={deleteProjectMutation}
          router={router}
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
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
