import React, { useState } from "react"
import { useQuery, useMutation } from "blitz"
import styled from "@emotion/styled"
import getCategories from "app/categories/queries/getCategories"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import EastIcon from "@mui/icons-material/East"
import createCategory from "app/categories/mutations/createCategory"
import { FORM_ERROR } from "app/labels/components/LabelForm"
import { ThemeProvider } from "@mui/material/styles"
import updateCategory from "app/categories/mutations/updateCategory"
import deleteCategory from "app/categories/mutations/deleteCategory"
import themeWize from "app/core/utils/themeWize"
import { adminRoleName } from "app/core/utils/constants"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getProjects from "app/projects/queries/getProjects"
import { InputSelect } from "app/core/components/InputSelect"
import { Form } from "app/core/components/Form"
import updateProjectCategory from "app/projects/mutations/updateProjectCategory"
import ModalBox from "../ModalBox"
import { UpdateProjectsCategory } from "app/projects/validations"

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true
    secondaryC: true
  }
}

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

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

const CategoryDataGrid = () => {
  const user = useCurrentUser()
  const createButtonText = "Create New Category"
  const [createCategoryMutation] = useMutation(createCategory)
  const [updateCategoryMutation] = useMutation(updateCategory)
  const [deleteCategoryMutation] = useMutation(deleteCategory)
  const [updateProjectCategoryMutation] = useMutation(updateProjectCategory)
  const [categories, { refetch }] = useQuery(getCategories, {})

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const [selectedID, setSelectedID] = useState("")

  const [{ projects, count: countProjectsSelected }, { refetch: refetchProjects }] = useQuery(
    getProjects,
    {
      where: {
        categoryName: selectedID,
      },
    }
  )

  const createNewCategory = async (values) => {
    try {
      const category = await createCategoryMutation(values)
      await refetch()
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        const savedRowValues = { id: category.name, name: category.name }
        return [...rows.slice(0, rowToDeleteIndex), savedRowValues]
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const editCategoryInfo = async (id: string, values: any) => {
    try {
      const updated = await updateCategoryMutation({
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
      const deleted = await deleteCategoryMutation({ name: selectedID })
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
    }

    if (row.isNew && isValid) {
      const newValues = { name: newName }
      idRef.api.setRowMode(id, "view")
      const resRowInsert = await createNewCategory(newValues)
      return
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      await editCategoryInfo(id, { name: newName })
      setRows((prevRows) => {
        const rowToEditIndex = prevRows.findIndex((rowValue) => rowValue.id === id)
        return [
          ...rows.slice(0, rowToEditIndex),
          { id: newName, name: newName },
          ...rows.slice(rowToEditIndex + 1),
        ]
      })
    }
  }

  const handleDeleteClick = (idRef) => {
    let id = idRef.row.id
    setSelectedID(() => id)
    setOpenDeleteModal(() => true)
  }

  const handleSubmit = async ({
    projectsIds,
    category,
  }: {
    projectsIds: string[]
    category: string
  }) => {
    await updateProjectCategoryMutation({
      ids: projectsIds,
      categoryName: category,
    })
    await deleteConfirmationHandler()
    await refetchProjects()
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
    categories.map((item) => ({
      id: item.name,
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
              <EastIcon color="inherit" />
            </Button>
          </>
        )
      },
    },
  ]

  const isMergeAction = projects.length > 0

  return (
    <div>
      <h2>Categories</h2>
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={themeWize}>
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
      <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>Choose the category to merge {selectedID} with </h2>
        <p>This action will delete {selectedID}</p>
        <p>This action cannot be undone.</p>
        <br />
        <p>
          {countProjectsSelected < 1
            ? "There are no projects"
            : countProjectsSelected === 1
            ? "There is 1 project"
            : `There are ${countProjectsSelected} projects`}{" "}
          with this category
        </p>
        <br />
        <div>
          <Form
            schema={UpdateProjectsCategory}
            onSubmit={async (values) => {
              await handleSubmit({
                projectsIds: projects.map((project) => project.id),
                category: values.categoryName.name,
              })
            }}
          >
            {isMergeAction && (
              <InputSelect
                valuesList={categories.filter((category) => category.name !== selectedID)}
                defaultValue=""
                name="categoryName"
                label="Category to merge with"
                disabled={false}
              />
            )}

            <ModalButtonsContainer>
              <Button className="primary default" onClick={() => setOpenDeleteModal(false)}>
                Cancel
              </Button>
              &nbsp;
              <Button
                className="primary warning"
                disabled={false}
                {...(isMergeAction
                  ? {
                      type: "submit",
                    }
                  : {
                      onClick: async () => {
                        await deleteConfirmationHandler()
                      },
                    })}
              >
                {isMergeAction ? "Merge" : "Delete"}
              </Button>
            </ModalButtonsContainer>
          </Form>
        </div>
      </ModalBox>
    </div>
  )
}
export default CategoryDataGrid
