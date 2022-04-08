import { useMutation, queryClient, invoke, useSession, useRouter, BlitzPage } from "blitz"
import { Button } from "@mui/material"
import styled from "@emotion/styled"
import stopImpersonating from "app/auth/mutations/stopImpersonating"
import impersonateUser, { ImpersonateUserInput } from "../auth/mutations/impersonateUsers"
import { Form, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { adminRoleName } from "app/core/utils/constants"

type FlexDirection = "row" | "column"

const formStyles = {
  display: "flex",
  flexDirection: "column" as FlexDirection,
  alignItems: "center",
  justifyContent: "center",
  margin: "20px",
  gap: "20px",
}

const ImpersonateUserForm: BlitzPage = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const [impersonateUserMutation] = useMutation(impersonateUser)
  const session = useSession()

  // eslint-disable-next-line no-unused-expressions
  user?.role !== adminRoleName && !session.impersonatingFromUserId && router.push("/")

  return (
    <div style={formStyles}>
      {!session.impersonatingFromUserId ? (
        <Form
          schema={ImpersonateUserInput}
          submitText="Switch to User"
          onSubmit={async (values) => {
            try {
              await impersonateUserMutation(values)
              queryClient.clear()
            } catch (error) {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }}
          style={formStyles}
        >
          <LabeledTextField
            name="userEmail"
            type="text"
            label="User Email"
            style={{ width: "30ch" }}
          />
        </Form>
      ) : (
        <div style={formStyles}>
          Currently impersonating user {session.profileId}{" "}
          <Button
            className="primary"
            onClick={async () => {
              await invoke(stopImpersonating, {})
              queryClient.clear()
            }}
          >
            Stop Impersonating
          </Button>
        </div>
      )}
      <Button className="primary" onClick={() => router.push("/")}>
        Go Home
      </Button>
    </div>
  )
}

ImpersonateUserForm.authenticate = true

export default ImpersonateUserForm
