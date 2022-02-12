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
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  useGridApiRef,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

import projects from "./projects"
import { ListItem } from "@mui/material"
import createLabel from "app/labels/mutations/createLabel"
import { LabelForm, FORM_ERROR } from "app/labels/components/LabelForm"

import getLabel from "app/labels/queries/getLabel"
import updateLabel from "app/labels/mutations/updateLabel"
import { useState } from "react"
import { RowingSharp } from "@mui/icons-material"

// Tool bara elemento de edicion
const EditToolbar = (props) => {
  const { apiRef, setRows } = props

  const handleClick = (idRef) => {
    const id = "new-value"
    const newName = ""
    // console.dir(idRef)
    // console.dir(apiRef)
    // apiRef.current.updateRows([{ id, isNew: true }])
    // apiRef.current.setRowMode(id, "edit")
    // Wait for the grid to render with the new row
    // setTimeout(() => {
    //   apiRef.current.scrollToIndexes({
    //     rowIndex: apiRef.current.getRowsCount() - 1,
    //   })

    //   apiRef.current.setCellFocus(id, "name")
    // })
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows]
      }
      return [...prevRows, { id, name: newName, isNew: true }]
    })
  }
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={(idRef) => handleClick(idRef)}>
        Create new LABEL
      </Button>
    </GridToolbarContainer>
  )
}

// EditToolbar.propTypes = {
//   apiRef: PropTypes.shape({
//     current: PropTypes.object.isRequired,
//   }).isRequired,
// }

const LabelsDataGrid = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [createLabelMutation] = useMutation(createLabel)
  const [{ labels }, { refetch }] = useQuery(
    getLabels,
    {
      orderBy: { name: "asc" },
    },
    { staleTime: 200, refetchInterval: 10000 }
  )

  const [updateLabelMutation] = useMutation(updateLabel)
  const editLabelInfo = async (id: string, values: any) => {
    try {
      const updated = await updateLabelMutation({
        id: id,
        ...values,
      })
      refetch()
      console.log("Values were UPDATED for label")
      // router.push(Routes.ManagerPage())
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const createNewLabel = async (values) => {
    try {
      const label = await createLabelMutation(values)
      console.log("Info was saved")
      refetch()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  // Set handles for interactions
  const apiRef = useGridApiRef()

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true
  }

  const handleCellFocusOut = (params, event) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (id) => {
    id.api.setRowMode(id.row.id, "edit")
    console.dir(id)
  }
  const handleSaveClick = async (idRef) => {
    // event.stopPropagation()
    // Wait for the validation to run

    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    if (row && row.isNew && isValid) {
      let newLabel = idRef.api.getCellValue(id, "name")
      const newValues = { name: newLabel }
      idRef.api.setRowMode(id, "view")
      await createNewLabel(newValues)
      console.log("the row was Saved")
      return
      // Remove row that has the name of a new
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      let newLabel = idRef.api.getCellValue(id, "name")
      await editLabelInfo(id, { name: newLabel })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
      console.log(`New Label Value: ${newLabel}`)
      // router.push(Routes.ManagerPage())
    }
  }

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation()
    apiRef.current.updateRows([{ id, _action: "delete" }])
  }

  const setRowModeEdit = (idRef) => {
    console.log(`Make the row Editable: ${idRef.api.id}`)
  }

  const handleCancelClick = async (idRef) => {
    // event.stopPropagation()
    const id = idRef.row.id
    idRef.api.setRowMode(id, "view")

    const row = idRef.api.getRow(id)
    if (row && row.isNew) {
      console.log("This row will not be CREATED")
      await idRef.api.updateRows([{ id, _action: "delete" }])
      // const handleDeleteRow = () => {
      console.dir(rows)
      await setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        console.log(prevRows)
        return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
      })
      // }
      // Remove row that has the name of a new
    }
  }
  // const [labels, setLabels] = useState(fetchedLabels)
  const [rows, setRows] = useState(() =>
    labels.map((item, key) => ({
      id: item.id,
      name: item.name,
      // edit: "delete",
    }))
  )
  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: true },

    {
      field: "actions",
      // type: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (id) => {
        // console.log("Th Row id", id.row.id)
        if (id.row.id === "new-value") {
          id.api.setRowMode(id.row.id, "edit")
          id.api.setCellFocus(id.row.id, "name")
          console.dir(id.api)
        }
        const isInEditMode = id.api.getRowMode(id.row.id) === "edit"
        if (isInEditMode) {
          return (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleCancelClick(id)}
                style={{ marginLeft: 16, backgroundColor: "#AF2E33" }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSaveClick(id)}
                style={{ marginLeft: 16, backgroundColor: "#2ea6af" }}
              >
                Save
              </Button>
            </>
          )
        }

        return (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEditClick(id)}
              style={{ marginLeft: 16, backgroundColor: "#AF2E33" }}
            >
              Edit
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <h2>Labels</h2>
      {/* <div style={{ height: 300, width: "100%" }}> */}
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            apiRef={apiRef}
            rowsPerPageOptions={[10]}
            pageSize={10}
            editMode="row"
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            onCellFocusOut={handleCellFocusOut}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { apiRef, setRows },
            }}
          />
        </div>
      </div>

      <h3>Create Label</h3>
      <LabelForm
        submitText="Create Label"
        onSubmit={(values) => {
          createNewLabel(values)
        }}
      />
    </div>
  )
}

const ManagerPage: BlitzPage = () => {
  return (
    <div>
      <Header title="Manager" />
      <Wrapper className="homeWrapper">
        <CardBox title="Parameters">
          <LabelsDataGrid />
        </CardBox>
      </Wrapper>
    </div>
  )
}
ManagerPage.authenticate = true
// ManagerPage.suppressFirstRenderFlicker = true
ManagerPage.getLayout = (page) => <Layout title={"Parameters"}>{page}</Layout>

export default ManagerPage
