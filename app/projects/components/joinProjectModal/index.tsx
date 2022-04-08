import React from "react"
import { z } from "zod"
import { Form } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import ModalBox from "app/core/components/ModalBox"
import Button from "@mui/material/Button"

import useProjectMembers from "app/projects/hooks/useProjectMembers"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { Grid, FormDivContainer, CommitmentDivContainer } from "./joinProjectModal.styles"
import { Routes, useRouter } from "blitz"

interface IProps {
  open: boolean
  handleCloseModal: Function
  projectId: string
}

export const JoinFields = z.object({
  role: z.string(),
  hoursPerWeek: z.string().refine((val) => !val || /^\d+$/.test(val), {
    message: "Value must be an integer",
  }),
  practicedSkills: z.array(z.any()),
})

const JoinProjectModal = (props: IProps) => {
  const router = useRouter()
  const { createProjectMemberHandler } = useProjectMembers()
  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      handleClose={() => {}}
      boxStyle={{ width: "800px" }}
    >
      <Form
        schema={JoinFields}
        onSubmit={async (values) => {
          try {
            props.handleCloseModal()
            createProjectMemberHandler({
              projectId: props.projectId,
              role: values.role,
              hoursPerWeek: parseInt(values.hoursPerWeek),
              practicedSkills: values.practicedSkills,
            })

            router.push(Routes.JoinSuccess({ projectId: props.projectId }))
          } catch (error) {
            console.error(error)
          }
        }}
      >
        <Grid>
          <FormDivContainer>
            <h1>Join Project</h1>

            <p className="question">What role will you be playing?</p>
            <LabeledTextField
              name="role"
              fullWidth
              label="Role"
              outerProps={{ style: { marginTop: 10, marginBottom: 20 } }}
            />

            <p className="question">What's your availability?</p>
            <LabeledTextField
              name="hoursPerWeek"
              fullWidth
              label="Hours per Week"
              outerProps={{ style: { marginTop: 10, marginBottom: 20 } }}
            />

            <p className="question">Which skills are you practicing?</p>
            <SkillsSelect name="practicedSkills" label="Skills" />
          </FormDivContainer>

          <CommitmentDivContainer>
            <p className="title">We are excited to have you on board!</p>
            <div className="paragraph">
              Everyone is welcome to join the project, whether you have the skills we are looking
              for, wish to sharpen them even more, or are eager to learn something new. <br />
              Take ownership of your role in the project, stay on track with your Contributor Path,
              take initiative, participate and ask questions. Stay informed about the project's
              latest updates, and keep the team updated about your progress as well. Your commitment
              to the project is important, but keep in mind that if you are assigned to work with a
              client it will have a higher priority. <br />
              If at any time you wish to leave the project you are completely free to do so, just
              let your team know about it and keep them updated on your latest contributions in
              order to help everyone adapt and continue working as smoothly as possible.
              <br />
            </div>

            <Button type="submit" className="primary large">
              Join Project
            </Button>
          </CommitmentDivContainer>
        </Grid>
      </Form>
    </ModalBox>
  )
}

export default JoinProjectModal
