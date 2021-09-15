import { Image, Link } from "blitz"
import styled from "@emotion/styled"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  return (
    <Panel>
      <Image src="/wizeline.svg" alt="Wizeline" width="28" height="28" />
      <LoginFormStyled>
        <Body>
          <Greet>Welcome back Wizeliner!</Greet>
          <Link href="/api/auth/auth0">
            <Button>Login with your Wizeline email account</Button>
          </Link>
        </Body>
        <Footer />
      </LoginFormStyled>
    </Panel>
  )
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 26.25rem;
  margin-top: 5.25rem;
  height: 100%;
`
const Greet = styled.span`
  font-size: 24px;
  font-weight: 500;
`

const LoginFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.1875rem;
  background-color: rgb(255, 255, 255);
  align-items: center;
  padding-top: 2.5rem;
  margin-top: 3.25rem;
  font-size: 0.875rem;
  border: solid 1px #e6e7e8;
`

const Button = styled.div`
  font-size: 0.9rem;
  background-color: #0a76db;
  padding: 1rem 2rem;
  color: #f4f4f4;
  text-align: center;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    background-color: #0966be;
  }
`

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 4rem;
  background-color: rgb(247, 249, 250);
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem 2.5rem 1.5rem;
`

export default LoginForm
