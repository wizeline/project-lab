import React from "react"
import { z } from "zod"
import { Form } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import ModalBox from "app/core/components/ModalBox"
import { Button } from "@mui/material"
import useProjectMembers from "app/projects/hooks/useProjectMembers"
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
          </FormDivContainer>

          <CommitmentDivContainer>
            <p className="title">Commitment is very important to us</p>
            <div className="paragraph">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci possimus animi
              blanditiis fuga harum id nostrum ea? Exercitationem ipsum laborum quae debitis, beatae
              recusandae, similique nemo amet, dolorem quisquam ut! Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Obcaecati suscipit error harum, corrupti quos nemo iure
              officiis ratione eum nam impedit ea recusandae culpa minus, tenetur quisquam rerum ad
              natus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet quis quibusdam
              saepe veniam exercitationem hic tempore laudantium molestias mollitia, illo nulla
              deserunt neque. Harum ipsam ipsa deserunt nisi beatae eveniet!
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
