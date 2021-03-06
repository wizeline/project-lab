import { useQuery, useMutation } from "blitz"
import { useState } from "react"

import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import { ThemeProvider } from "@mui/material/styles"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { adminRoleName } from "app/core/utils/constants"
import themeWize from "app/core/utils/themeWize"
import { FORM_ERROR } from "app/labels/components/LabelForm"
import ConfirmationModal from "../ConfirmationModal"

import getAdminUsers from "../../../users/queries/getAdminUsers"
import addAdminUser from "app/users/mutations/addAdminUser"
import removeAdminRole from "app/users/mutations/removeAdminRole"

const GridEditToolbar = (props) => {
  const { setRows, createButtonText, user } = props

  const handleAddClick = () => {
    const id = "new-value"
    const newName = ""
    const newEmail = ""
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows]
      }
      return [...prevRows, { id, name: newName, email: newEmail, isNew: true }]
    })
  }
  if (user?.role !== adminRoleName) return <></>
  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleAddClick()}
      >
        {createButtonText}
      </Button>
    </GridToolbarContainer>
  )
}

const AdminsDataGrid = () => {
  const user = useCurrentUser()
  const [error, setError] = useState<string>("")
  const createButtonText = "Add New Admin"
  const [admins, { refetch }] = useQuery(getAdminUsers, null)
  const [addAdminUserMutation] = useMutation(addAdminUser)
  const [removeAdminRoleMutation] = useMutation(removeAdminRole)

  // handle Delete Admin variables
  const [selectedRowID, setSelectedRowID] = useState("")
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const addNewAdminUser = async (values) => {
    try {
      const admin = await addAdminUserMutation(values)
      await refetch()
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        const savedRowValues = { id: admin.id, name: admin.name, email: admin.email }
        return [...rows.slice(0, rowToDeleteIndex), savedRowValues]
      })
      setError("")
    } catch (error: any) {
      console.error(error)
      setError(error.toString())
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false)
    try {
      const deleted = await removeAdminRoleMutation({ id: +selectedRowID })
      refetch()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }

    setRows((prevRows) => prevRows.filter((rowValue) => rowValue.id !== +selectedRowID))
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
    setError("")
  }

  const handleSaveClick = async (idRef) => {
    const id = idRef.row.id

    const row = idRef.api.getRow(id)
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    const newEmail = idRef.api.getCellValue(id, "email")

    if (rows.find((rowValue) => rowValue.email === newEmail)) {
      console.error("Field Already exists")
      setError("Error: User is already an admin")
      return
    } else {
      console.error("All fields are valid")
    }

    if (row.isNew && isValid) {
      const newValues = { email: newEmail }
      idRef.api.setRowMode(id, "view")
      const resRowInsert = await addNewAdminUser(newValues)
      return
    }
  }
  const handleDeleteClick = (idRef) => {
    let id = idRef.row.id
    setSelectedRowID(() => id)
    setOpenDeleteModal(() => true)
  }

  const [rows, setRows] = useState(() =>
    admins.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
    }))
  )

  const columns = [
    { field: "email", headerName: "Email", width: 300, editable: true },
    { field: "name", headerName: "Name", width: 300, editable: false },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (idRef: any) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit")
          idRef.api.setCellFocus(idRef.row.id, "email")
        }
        const isInEditMode = idRef.api.getRowMode(idRef.row.id) === "edit"
        if (user?.role !== adminRoleName) {
          return <></>
        }
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
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleDeleteClick(idRef)}
            style={{ marginLeft: 16 }}
          >
            <DeleteIcon color="inherit" />
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={themeWize}>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
                toolbar: { setRows, createButtonText, user },
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
        label="Remove"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteConfirmationHandler()
        }}
      >
        <h2>
          Are you sure you want to remove the Admin role from{" "}
          {rows[rows.findIndex((row) => row.id === +selectedRowID)]?.email}?
        </h2>
        <br />
      </ConfirmationModal>
    </>
  )
}

export default AdminsDataGrid
