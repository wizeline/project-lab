import {
  usePaginatedQuery,
  useRouter,
  Router,
  BlitzPage,
  Routes,
  useQuery,
  useMutation,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"
import CardBox from "app/core/components/CardBox"
import { Wrapper } from "./projects/projects.styles"
import LabelsSelect from "app/core/components/LabelsSelect"
import getLabels from "app/labels/queries/getLabels"
import { Form, FormProps } from "app/core/components/Form"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import projects from "./projects"
import { ListItem } from "@mui/material"
import createLabel from "app/labels/mutations/createLabel"
import { LabelForm, FORM_ERROR } from "app/labels/components/LabelForm"
// Delete when cleaning up
// const rows: GridRowsProp = [
//   { id: 1, col1: "Summer2021", col2: "Delete" },
//   { id: 2, col1: "Summer2022", col2: "Delete" },
//   { id: 3, col1: "Summer2020", col2: "Delete" },
// ]

const LABELS_PER_PAGE = 100

const SomeButton = (puid) => {
  const manageEdition = (puid: string = "someID") => {
    console.dir(puid)
    console.log(`Edit: ${puid}`)
  }

  return (
    <strong>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => manageEdition(puid.row.id)}
        style={{ marginLeft: 16, backgroundColor: "#AF2E33" }}
      >
        Edit
      </Button>
    </strong>
  )
}

const ManagerPage: BlitzPage = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [createLabelMutation] = useMutation(createLabel)

  // Turn into its own compoennet
  const [{ labels, hasMore }] = usePaginatedQuery(getLabels, {
    orderBy: { name: "asc" },
    skip: LABELS_PER_PAGE * page,
    take: LABELS_PER_PAGE,
  })

  const rows: GridRowsProp = labels.map((item, key) => ({
    id: item.id,
    col1: item.name,
    col2: "delete",
    // col3: item.id,
  }))

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Name", width: 300 },
    { field: "col2", headerName: "Edition", width: 150, renderCell: SomeButton },
    // { field: "col3", headerName: "ID", width: 150 },
  ]

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Header title="Manager" />
      {/* Check if the search option in the header should be a prop, in order to not show it in this type pf pages */}
      <Wrapper className="homeWrapper">
        <CardBox title="Parameters">
          <div>
            <h2>Labels</h2>
            <LabelForm
              submitText="Create Label"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={CreateLabel}
              // initialValues={{}}
              onSubmit={async (values) => {
                try {
                  const label = await createLabelMutation(values)
                  // router.push(Routes.ShowLabelPage({ labelId: label.id }))
                  console.log("Info was saved")
                  router.push(Routes.ManagerPage())
                  // labels.push(values.name)
                } catch (error: any) {
                  console.error(error)
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
            />
            <div>
              {labels.map((item, key) => (
                <p key={key}>{item.name}</p>
              ))}
            </div>
            {/* <LabelsSelect name="labels" label="Labels" /> */}
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} pageSize={4} />
            </div>
          </div>
        </CardBox>
      </Wrapper>
    </div>
  )
}
ManagerPage.authenticate = true
// ManagerPage.suppressFirstRenderFlicker = true
ManagerPage.getLayout = (page) => <Layout title={"Parameters"}>{page}</Layout>

export default ManagerPage
