import React from "react"
import styled from "@emotion/styled"
import TextField from "@material-ui/core/TextField"

function TheTheam() {
  return (
    <div style={{ maxWidth: "440px" }}>
      <Title>The roles</Title>
      <div>Carolina Guzmán</div>
      <div style={{ width: "160px", marginBottom: "96px" }}>
        <Button>Add member</Button>
      </div>
      <Title>Risks and challenges</Title>
      <TextField
        fullWidth
        id="outlined-basic"
        placeholder="What would be the risks?"
        variant="outlined"
      />
      <div style={{ maxWidth: "260px", marginLeft: "auto", marginTop: "103px" }}>
        <Button>I want to send my proposal!</Button>
      </div>
    </div>
  )
}

const Title = styled.div`
  color: #252a2f;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 30px;
`

const Button = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  background-color: #ff6f18;
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

export default TheTheam
