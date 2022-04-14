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
            <ul>
              <li>
                <strong>Everyone</strong> is welcome to join the project, whether you have the
                skills we are looking for and want to sharpen them, or are eager to learn something
                new.
              </li>
              <li>
                Take <strong>ownership</strong> of your role in the project, stay on track with your
                Contributor Path, take initiative, participate and ask questions.
              </li>
              <li>
                Keep in mind that if you are assigned to work with a client it will have a higher
                priority, but you can keep participating.
              </li>
              <li>
                You are free to leave a project at any time, just let your team know about it and do
                a <strong>knowledge transfer</strong> of your latest contributions.
              </li>
            </ul>
            <p>&nbsp;</p>
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
