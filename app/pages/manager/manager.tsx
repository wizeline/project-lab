import { usePaginatedQuery, useRouter, Router, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"
import CardBox from "app/core/components/CardBox"
import { Wrapper } from "../projects/projects.styles"
import LabelsSelect from "app/core/components/LabelsSelect"
import getLabels from "app/labels/queries/getLabels"
import { Form, FormProps } from "app/core/components/Form"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import projects from "../projects"
import { ListItem } from "@mui/material"

// Delete when cleaning up
// const rows: GridRowsProp = [
//   { id: 1, col1: "Summer2021", col2: "Delete" },
//   { id: 2, col1: "Summer2022", col2: "Delete" },
//   { id: 3, col1: "Summer2020", col2: "Delete" },
// ]

const columns: GridColDef[] = [
  { field: "col1", headerName: "Name", width: 150 },
  { field: "col2", headerName: "Edition", width: 150 },
]

const LABELS_PER_PAGE = 10

const ManagerPage: BlitzPage = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0

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
  }))

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
            <div>
              {labels.map((item, key) => (
                <p key={key}>{item.name}</p>
              ))}
            </div>
            {/* <LabelsSelect name="labels" label="Labels" /> */}
            <div style={{ height: 300, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
          </div>
        </CardBox>
      </Wrapper>
    </div>
  )
}
ManagerPage.authenticate = true
ManagerPage.getLayout = (page) => <Layout title="Parameters">{page}</Layout>

export default ManagerPage
