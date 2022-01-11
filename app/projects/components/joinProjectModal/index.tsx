import React from "react"
import InputSelect from "app/core/components/InputSelect"
import { Form } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { skills, availabilityValues } from "app/core/utils/constants"
import { Close as CloseIcon } from "@mui/icons-material"
import { IconButton } from "@mui/material"

import {
  Grid,
  ModalResponsive,
  FormDivContainer,
  CommitmentDivContainer,
  OrangeColoredButton,
} from "./joinProjectModal.styles"
import { Routes, useRouter } from "blitz"

interface IProps {
  open: boolean
  handleCloseModal: Function
  projectId: any
}

const JoinProjectModal = (props: IProps) => {
  const handleCloseModal = () => props.handleCloseModal()
  const router = useRouter()

  return (
    <ModalResponsive open={props.open} handleClose={() => {}}>
      <Form
        {...props}
        onSubmit={async (values) => {
          try {
            props.handleCloseModal()

            router.push(Routes.JoinSuccess({ projectId: props.projectId }))
            console.log(values)
          } catch (error) {
            console.error(error)
          }
        }}
      >
        <Grid>
          <FormDivContainer>
            <h1>Join Project</h1>

            <p className="question">What do you want to join?</p>
            <LabeledTextField
              name="body"
              multiline
              fullWidth
              rows={5}
              label="Why are you interested in this project?"
              outerProps={{ style: { marginTop: 10, marginBottom: 20 } }}
            />

            <p className="question">What role will you be taking?</p>
            <InputSelect valuesList={skills} name="skills" label="Skills" margin="none" />

            <p className="question">How many hours will you invest in this project?</p>
            <InputSelect
              valuesList={availabilityValues}
              name="availability"
              label="Availability"
              margin="none"
            />
          </FormDivContainer>

          <CommitmentDivContainer>
            <IconButton
              onClick={handleCloseModal}
              style={{ color: "#ff6f18", alignSelf: "flex-end" }}
            >
              <CloseIcon />
            </IconButton>

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

            <OrangeColoredButton type="submit" variant="contained">
              Join Project
            </OrangeColoredButton>
          </CommitmentDivContainer>
        </Grid>
      </Form>
    </ModalResponsive>
  )
}

export default JoinProjectModal
