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

const GridEditToolbar = (props) => {
  const { setRows, createButtonText, user } = props
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
  const createButtonText = "Add New Admin"

  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: false },
    { field: "email", headerName: "Email", width: 300, editable: false },
  ]

  const admins = [
    {
      id: "1",
      name: "tester",
      email: "test@test.com",
    },
  ]

  const [rows, setRows] = useState(() =>
    admins.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
    }))
  )

  return (
    <div style={{ display: "flex", width: "100%", height: "70vh" }}>
      <div style={{ flexGrow: 1 }}>
        <ThemeProvider theme={themeWize}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowsPerPageOptions={[50]}
            pageSize={50}
            editMode="row"
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
  )
}

export default AdminsDataGrid
