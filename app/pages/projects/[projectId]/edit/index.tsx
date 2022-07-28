import { Suspense, SyntheticEvent, useState } from "react"
import { Box, Tabs } from "@mui/material"
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
import updateStages from "app/projects/mutations/updateStages"
import deleteProject from "app/projects/mutations/deleteProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { FullCreate, ContributorPath } from "app/projects/validations"
import DeleteButton from "app/projects/components/DeleteButton.component"
import TabPanel from "app/projects/components/TabPanel.component"
import { ProjectContributorsPathForm } from "app/projects/components/ProjectContributorsPathForm"
import { MentorshipTable } from "app/projects/components/MentorshipTable"
import { TabStyles, EditPanelsStyles } from "app/projects/components/Styles/TabStyles.component"
import { useCurrentUser } from "../../../../core/hooks/useCurrentUser"
import { adminRoleName } from "app/core/utils/constants"

export const EditProject = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const projectId = useParam("projectId", "string")
  const [deleteProjectMutation] = useMutation(deleteProject)
  const [project, { setQueryData, refetch }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)

  const [projectMembers] = useQuery(getProjectMembers, { id: project.id })
  const existedMembers = projectMembers.map((member) => member.id)

  const [updateProjectMutation] = useMutation(updateProject)
  const [updateStageMutation] = useMutation(updateStages)
  const isTeamMember = useSessionUserIsProjectTeamMember(project)

  if (!isTeamMember && user?.role !== adminRoleName) {
    return <AccessDenied />
  }

  async function handleSubmitProjectDetails(values) {
    values.existedMembers = existedMembers

    try {
      const updated = await updateProjectMutation({
        id: project.id,
        isAdmin: user?.role === adminRoleName,
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

  function retrieveProjectInfo() {
    return {
      id: project.id,
      isAdmin: user?.role === adminRoleName,
      projectMembers: project.projectMembers,
      owner: project.owner,
    }
  }

  async function handleSubmitContributorPath(values) {
    try {
      await updateStageMutation({
        ...retrieveProjectInfo(),
        ...values,
      })
      await refetch()
      router.push(Routes.ShowProjectPage({ projectId: project.id }))
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
        <h1 className="form__center-text">Edit {project.name}</h1>
      </div>

      <div className="wrapper">
        <GoBack
          title="Back to project"
          onClick={() => router.push(Routes.ShowProjectPage({ projectId: project.id }))}
        />

        <EditPanelsStyles>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit project">
              <TabStyles label="Project Details" />
              <TabStyles label="Contributor's Path" />
              <TabStyles label="Mentorship Details" />
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <ProjectForm
              submitText="Update Project"
              schema={FullCreate}
              initialValues={project}
              onSubmit={handleSubmitProjectDetails}
              buttonType="button"
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ProjectContributorsPathForm
              submitText="Update Stages "
              schema={ContributorPath}
              initialValues={project.stages}
              onSubmit={handleSubmitContributorPath}
              projectId={project.id}
              retrieveProjectInfo={retrieveProjectInfo}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <MentorshipTable />
          </TabPanel>
        </EditPanelsStyles>
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
