import { Suspense, useState } from "react"
import { useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import { useSessionUserIsProjectTeamMember } from "app/core/hooks/useSessionUserIsProjectTeamMember"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import Loader from "app/core/components/Loader"
import AccessDenied from "app/core/components/AccessDenied"
import ConfirmationModal from "app/core/components/ConfirmationModal"
import getProject from "app/projects/queries/getProject"
import getProjectMembers from "app/projects/queries/getProjectMembers"
import updateProject from "app/projects/mutations/updateProject"
import deleteProject from "app/projects/mutations/deleteProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate } from "app/projects/validations"
import { TextField } from "@mui/material"

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
    try {
      await props.deleteProjectMutation({ id: props.project.id })
      props.router.push(Routes.ProjectsPage())
    } catch (error) {
      handleClose()
      console.log(error)
      setHasError(true)
    }
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

      <ConfirmationModal
        open={open}
        handleClose={handleClose}
        close={() => handleClose()}
        label="Delete"
        className="warning"
        disabled={deleteBtn}
        onClick={deleteProposal}
      >
        <h2>Are you sure you want to delete this proposal?</h2>
        <p>This action cannot be undone.</p>
        <br />
        <TextField
          label={`Type ${props.project.name}`}
          type="text"
          error={hasError}
          style={{ width: "100%" }}
          onChange={projectName}
        />
        <br />
      </ConfirmationModal>
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

  const [projectMembers] = useQuery(getProjectMembers, { id: project.id })
  const existedMembers = projectMembers.map((member) => member.id)

  const [updateProjectMutation] = useMutation(updateProject)
  const isTeamMember = useSessionUserIsProjectTeamMember(project)

  if (!isTeamMember) {
    return <AccessDenied />
  }

  return (
    <>
      <Header title={"Edit " + project.name} />
      <div className="wrapper">
        <h1 className="form__center-text">Edit {project.name}</h1>
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
            values.existedMembers = existedMembers

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
      <div className="wrapper form__center-text">
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
      <Suspense fallback={<Loader />}>
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
