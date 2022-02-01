import { Suspense, SyntheticEvent, useState } from "react"
import { useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import { useSessionUserIsProjectTeamMember } from "app/core/hooks/useSessionUserIsProjectTeamMember"
import Layout from "app/core/layouts/Layout"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import Loader from "app/core/components/Loader"
import AccessDenied from "app/core/components/AccessDenied"
import getProject from "app/projects/queries/getProject"
import getProjectMembers from "app/projects/queries/getProjectMembers"
import updateProject from "app/projects/mutations/updateProject"
import deleteProject from "app/projects/mutations/deleteProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate, ContributorPath } from "app/projects/validations"

import { Box, Tab, Tabs } from "@mui/material"
import DeleteButton from "app/projects/components/DeleteButton.component"
import TabPanel from "app/projects/components/TabPanel.component"
import { ProjectContributorsPathForm } from "app/projects/components/ProjectContributorsPathForm"

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

  const [tabIndex, setTabIndex] = useState(1)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)

  const [projectMembers] = useQuery(getProjectMembers, { id: project.id })
  const existedMembers = projectMembers.map((member) => member.id)

  const [updateProjectMutation] = useMutation(updateProject)
  const isTeamMember = useSessionUserIsProjectTeamMember(project)

  if (!isTeamMember) {
    return <AccessDenied />
  }

  async function handleSubmitProjectDetails(values) {
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
  }

  async function handleSubmitContributorPath(values) {
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
  }

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

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit project">
            <Tab label="Project Details" />
            <Tab label="Contributors Path" />
          </Tabs>
        </Box>

        <TabPanel value={tabIndex} index={0}>
          <br />
          <ProjectForm
            submitText="Update Project"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            schema={FullCreate}
            initialValues={project}
            onSubmit={handleSubmitProjectDetails}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <br />
          <ProjectContributorsPathForm
            submitText="Update Stages"
            schema={ContributorPath}
            initialValues={project.stages}
            onSubmit={handleSubmitProjectDetails}
          />
        </TabPanel>
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
      <Suspense fallback={<Loader />}>
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
