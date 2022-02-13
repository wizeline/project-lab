import { useRouter, useQuery, useMutation } from "blitz"
import getLabels from "app/labels/queries/getLabels"
import { DataGrid, useGridApiRef, GridToolbarContainer } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

import createLabel from "app/labels/mutations/createLabel"
import { LabelForm, FORM_ERROR } from "app/labels/components/LabelForm"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import updateLabel from "app/labels/mutations/updateLabel"
import { useState } from "react"

const theme = createTheme({
  palette: {
    primary: {
      light: "#E94D44",
      main: "#AF2E33",
      dark: "#751F22",
      contrastText: "#fff",
    },
    // secondary: {
    //   light: "#C7D4E5",
    //   main: "#3B72A4",
    //   dark: "#4E90B9",
    //   contrastText: "#fff",
    // },
    secondary: { main: "#3B72A4" },
    // error: "red",
  },
})
// Tool bara elemento de edicion
const GridEditToolbar = (props) => {
  const { apiRef, setRows, createButtonText } = props

  const handleAddClick = () => {
    const id = "new-value"
    const newName = ""
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows]
      }
      return [...prevRows, { id, name: newName, isNew: true }]
    })
  }
  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: "#e94d44" }}
        startIcon={<AddIcon />}
        onClick={() => handleAddClick()}
      >
        {createButtonText}
      </Button>
    </GridToolbarContainer>
  )
}

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
      console.log(refetch())
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
      console.log("Labelprevious val", labels)
      const label = await createLabelMutation(values)
      console.log("Info was saved")
      console.dir(label)
      await refetch()
      // Set the new row value in table =
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        const savedRowValues = { id: label.id, name: label.name }
        console.log("prev_array", prevRows)
        console.log("new Values for row", savedRowValues)
        return [...rows.slice(0, rowToDeleteIndex), savedRowValues]
      })
      // await console.log("Label const new Val", labels)
      // setRows(() => [...labels])
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
    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    const newLabel = idRef.api.getCellValue(id, "name")

    if (rows.find((rowValue) => rowValue.name === newLabel)) {
      console.error("Field Already exists")
      return
    } else {
      console.error("All fields are valid")
    }

    if (idRef.api.getCellValue(id, "name"))
      if (row.isNew && isValid) {
        // let newLabel = idRef.api.getCellValue(id, "name")
        const newValues = { name: newLabel }
        idRef.api.setRowMode(id, "view")
        const resRowInsert = await createNewLabel(newValues)
        console.log("Label const new Val", labels)
        console.dir(resRowInsert)
        return
        // Remove row that has the name of a new
      }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      // let newLabel = idRef.api.getCellValue(id, "name")
      await editLabelInfo(id, { name: newLabel })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
      console.log(`New Label Value: ${newLabel}`)
      // router.push(Routes.ManagerPage())
    }
  }

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation()
    // apiRef.current.updateRows([{ id, _action: "delete" }])
  }

  const handleCancelClick = async (idRef) => {
    // event.stopPropagation()
    const id = idRef.row.id
    idRef.api.setRowMode(id, "view")

    const row = idRef.api.getRow(id)
    if (row && row.isNew) {
      console.log("This row will not be CREATED")
      await idRef.api.updateRows([{ id, _action: "delete" }])

      console.dir(rows)
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        console.log(prevRows)
        return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
      })
    }
  }

  const [rows, setRows] = useState(() =>
    labels.map((item) => ({
      id: item.id,
      name: item.name,
      // edit: "delete",
    }))
  )
  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: true },

    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (id: any) => {
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
                style={{ marginLeft: 16 }}
              >
                <CancelIcon color="inherit" />
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleSaveClick(id)}
                style={{ marginLeft: 16 }}
              >
                <SaveIcon color="inherit" />
              </Button>
            </>
          )
        }
        return (
          <>
            {/* backgroundColor: "#AF2E33" */}
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditClick(id)}
              style={{ marginLeft: 16 }}
            >
              <EditIcon color="inherit" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleDeleteClick(id)}
              style={{ marginLeft: 16 }}
            >
              <DeleteIcon color="inherit" />
            </Button>
          </>
        )
      },
    },
  ]
  const createButtonText = "Create New Label"
  return (
    <div>
      <h2>Labels</h2>
      {/* <div style={{ height: 300, width: "100%" }}> */}
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={rows}
              columns={columns}
              rowsPerPageOptions={[50]}
              pageSize={50}
              editMode="row"
              onRowEditStart={handleRowEditStart}
              onRowEditStop={handleRowEditStop}
              onCellFocusOut={handleCellFocusOut}
              components={{
                Toolbar: GridEditToolbar,
              }}
              componentsProps={{
                toolbar: { apiRef, setRows, createButtonText },
              }}
            />
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}
export default LabelsDataGrid
