import { Image, Link } from "blitz"
import { Panel, Greet, StyledLoginForm, Button, Footer, Body } from "./LoginForm.styles"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  return (
    <Panel>
      <Image src="/wizeline.svg" alt="Wizeline" width="28" height="28" />
      <StyledLoginForm>
        <Body>
          <Greet>Welcome back Wizeliner!</Greet>
          <a href="/api/auth/auth0">
            <Button>Login with your Wizeline email account</Button>
          </a>
        </Body>
        <Footer />
      </StyledLoginForm>
    </Panel>
  )
}

export default LoginForm
