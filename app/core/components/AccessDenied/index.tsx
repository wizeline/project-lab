import { useRouter, Routes } from "blitz"
import GoBack from "app/core/layouts/GoBack"
import { Typography, Grid, Container } from "@mui/material"

export const AccessDenied = () => {
  const router = useRouter()

  return (
    <div className="wrapper">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Container maxWidth="sm">
            <Typography variant="h6" component="h5">
              You don't have permission to view this page.
            </Typography>
          </Container>
        </Grid>
        <Grid item xs={12}>
          <GoBack
            title="Back to main page"
            onClick={() => router.push(Routes.SearchProjectsPage())}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default AccessDenied
