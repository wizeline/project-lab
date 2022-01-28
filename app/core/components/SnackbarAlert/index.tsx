import { useState, useEffect } from "react"
import { Snackbar, Alert, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"

const SnackbarAlert = ({ message, time, show }) => {
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    if (show) setShowAlert(true)

    setAlertMessage(message)
    const timeout = setTimeout(() => {
      setShowAlert(false)
    }, time)

    return () => clearTimeout(timeout)
  }, [message, time, show])

  return (
    <Snackbar open={showAlert}>
      <Alert
        severity="success"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setShowAlert(false)
            }}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  )
}
SnackbarAlert.defaultProps = {
  time: 5000,
}
export default SnackbarAlert
