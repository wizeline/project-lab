import { useQuery, useMutation } from "blitz"
import getLabels from "app/labels/queries/getLabels"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
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
import React, { useContext, createContext, useState, useEffect, useMemo } from "react"
import ConfirmationModal from "../ConfirmationModal"
import deleteLabel from "app/labels/mutations/deleteLabel"

const theme = createTheme({
  palette: {
    primary: {
      light: "#E94D44",
      main: "#AF2E33",
      dark: "#751F22",
      contrastText: "#fff",
    },
    secondary: { main: "#3B72A4" },
  },
})

const GridEditToolbar = (props) => {
  const { setRows, createButtonText } = props
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
  const createButtonText = "Create New Label"
  const [createLabelMutation] = useMutation(createLabel)
  const [updateLabelMutation] = useMutation(updateLabel)
  const [deleteLabelMutation] = useMutation(deleteLabel)
  const [{ labels }, { refetch }] = useQuery(
    getLabels,
    {
      orderBy: { name: "asc" },
    },
    { refetchInterval: 10000 }
  )
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const [selectedID, setSelectedID] = useState("")

  const createNewLabel = async (values) => {
    try {
      const label = await createLabelMutation(values)
      await refetch()
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        const savedRowValues = { id: label.id, name: label.name }
        return [...rows.slice(0, rowToDeleteIndex), savedRowValues]
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const editLabelInfo = async (id: string, values: any) => {
    try {
      const updated = await updateLabelMutation({
        id: id,
        ...values,
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false)
    try {
      const deleted = await deleteLabelMutation({ id: selectedID })
      refetch()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
    setRows((prevRows) => {
      const rowToDeleteIndex = prevRows.findIndex((rowValue) => rowValue.id === selectedID)
      return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
    })
  }

  // Set handles for interactions

  const handleRowEditStart = (event) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop = (event) => {
    event.defaultMuiPrevented = true
  }

  const handleCellFocusOut = (event) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (idRef) => {
    idRef.api.setRowMode(idRef.row.id, "edit")
  }

  const handleSaveClick = async (idRef) => {
    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    const newName = idRef.api.getCellValue(id, "name")

    if (rows.find((rowValue) => rowValue.name === newName)) {
      console.error("Field Already exists")
      return
    } else {
      console.error("All fields are valid")
    }

    if (row.isNew && isValid) {
      const newValues = { name: newName }
      idRef.api.setRowMode(id, "view")
      const resRowInsert = await createNewLabel(newValues)
      return
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      await editLabelInfo(id, { name: newName })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
    }
  }

  const handleDeleteClick = (idRef) => {
    let id = idRef.row.id
    setSelectedID(() => id)
    setOpenDeleteModal(() => true)
  }

  const handleCancelClick = async (idRef) => {
    const id = idRef.row.id
    idRef.api.setRowMode(id, "view")

    const row = idRef.api.getRow(id)
    if (row && row.isNew) {
      await idRef.api.updateRows([{ id, _action: "delete" }])
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
      })
    }
  }

  const [rows, setRows] = useState(() =>
    labels.map((item) => ({
      id: item.id,
      name: item.name,
    }))
  )
  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: true },

    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (idRef: any) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit")
          idRef.api.setCellFocus(idRef.row.id, "name")
        }
        const isInEditMode = idRef.api.getRowMode(idRef.row.id) === "edit"
        if (isInEditMode) {
          return (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleCancelClick(idRef)}
                style={{ marginLeft: 16 }}
              >
                <CancelIcon color="inherit" />
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleSaveClick(idRef)}
                style={{ marginLeft: 16 }}
              >
                <SaveIcon color="inherit" />
              </Button>
            </>
          )
        }
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditClick(idRef)}
              style={{ marginLeft: 16 }}
            >
              <EditIcon color="inherit" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleDeleteClick(idRef)}
              style={{ marginLeft: 16 }}
            >
              <DeleteIcon color="inherit" />
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <h2>Labels</h2>
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
                toolbar: { setRows, createButtonText },
              }}
            />
          </ThemeProvider>
        </div>
      </div>
      {/* Confirmation for deletion */}
      <ConfirmationModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
        label="Delete"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteConfirmationHandler()
        }}
      >
        <h2>Are you sure you want to delete this Label ?</h2>
        <p>This action cannot be undone.</p>
        <br />
      </ConfirmationModal>
    </div>
  )
}
export default LabelsDataGrid
