import React, { useState } from "react"
import styled from "@emotion/styled"
import { TextField, Dialog } from "@mui/material"
import Title from "app/projects/components/Title"

function TheTheam() {
  const [showModal, setShowModal] = useState<boolean>(false)

  function onFinish(): void {
    setShowModal(true)
  }

  function onCloseModal(): void {
    setShowModal(false)
  }

  return (
    <Wrapper>
      <Title>The roles</Title>
      <div>Carolina Guzmán</div>
      <WrapAddMember>
        <Button>Add member</Button>
      </WrapAddMember>
      <Title>Risks and challenges</Title>
      <TextField fullWidth name="risks" placeholder="What would be the risks?" variant="outlined" />
      <WrapSendForm onClick={onFinish}>
        <Button>I want to send my proposal!</Button>
      </WrapSendForm>
      <Dialog open={showModal} onClose={onCloseModal}>
        <WrapperDialog>
          <WrapperDialogImage>
            <img src="/success-modal.png" alt="" />
          </WrapperDialogImage>
          <WrapperDialogText>
            <Title>Awesome!!!</Title>
            <p>We already published your idea</p>
            <WrapperDialogTextButton>
              <Button>Take me there</Button>
            </WrapperDialogTextButton>
          </WrapperDialogText>
        </WrapperDialog>
      </Dialog>
    </Wrapper>
  )
}

const Button = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  background-color: #e94d44;
  color: #ffffff;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 29px;
  padding: 7px;
  text-align: center;
  user-select: none;
  cursor: pointer;
`

const Wrapper = styled.div`
  max-width: 440px;
`

const WrapAddMember = styled.div`
  width: 160px;
  margin-bottom: 96px;
`

const WrapSendForm = styled.div`
  max-width: 260px;
  margin-left: auto;
  margin-top: 103px;
`

const WrapperDialog = styled.div`
  display: flex;
  padding: 48px 52px 20px 13px;
`

const WrapperDialogImage = styled.div`
  color: red;
`

const WrapperDialogText = styled.div`
  margin-left: 14px;
  p {
    color: #818181;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    margin-top: 6px;
    margin-bottom: 22px;
  }
`

const WrapperDialogTextButton = styled.div`
  margin-left: 15px;
  max-width: 160px;
`

export default TheTheam
