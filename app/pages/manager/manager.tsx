import { usePaginatedQuery, useRouter, Router, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"
import CardBox from "app/core/components/CardBox"
import { Wrapper } from "../projects/projects.styles"
import LabelsSelect from "app/core/components/LabelsSelect"

import { Form, FormProps } from "app/core/components/Form"

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"

const rows: GridRowsProp = [
  { id: 1, col1: "Summer2021", col2: "Delete" },
  { id: 2, col1: "Summer2022", col2: "Delete" },
  { id: 3, col1: "Summer2020", col2: "Delete" },
]

const columns: GridColDef[] = [
  { field: "col1", headerName: "Name", width: 150 },
  { field: "col2", headerName: "Edition", width: 150 },
]

const ManagerPage: BlitzPage = () => {
  return (
    <div>
      <Header title="Manager" />
      {/* Check if the search option in the header should be a prop, in order to not show it in this type pf pages */}
      <Wrapper className="homeWrapper">
        <CardBox title="Parameters">
          <div>
            <h2>Labels</h2>
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
