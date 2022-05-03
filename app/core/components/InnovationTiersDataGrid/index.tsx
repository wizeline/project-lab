import { useQuery, useMutation } from "blitz"
import styled from "@emotion/styled"

import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import EastIcon from "@mui/icons-material/East"
import ModalBox from "../ModalBox"
import { FORM_ERROR } from "app/labels/components/LabelForm"
import { ThemeProvider } from "@mui/material/styles"
import { InputSelect } from "app/core/components/InputSelect"

import { useState } from "react"
import ConfirmationModal from "../ConfirmationModal"

import themeWize from "app/core/utils/themeWize"
import { adminRoleName } from "app/core/utils/constants"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getInnovationTiers from "app/innovationTiers/queries/getInnovationTiers"
import createTier from "app/innovationTiers/mutations/createTier"
import updateTier from "app/innovationTiers/mutations/updateTier"
import deleteTier from "app/innovationTiers/mutations/deleteTier"
import getProjects from "app/projects/queries/getProjects"
import { Form } from "app/core/components/Form"
import { UpdateProjectsCategory, UpdateProjectsInoovationTier } from "app/projects/validations"
import updateTierProject from "app/projects/mutations/updateTierProject"

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

const InnovationTiersGrid = () => {
  const user = useCurrentUser()
  const createButtonText = "Create New Innovation Tier"
  const [createTierMutation] = useMutation(createTier)
  const [updateTierMutation] = useMutation(updateTier)
  const [deleteTierMutation] = useMutation(deleteTier)
  const [updateProjectTierMutation] = useMutation(updateTierProject)

  const [{ tiers }, { refetch }] = useQuery(
    getInnovationTiers,
    {
      orderBy: { name: "asc" },
    },
    { refetchInterval: 10000 }
  )

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const [selectedRowID, setSelectedRowID] = useState("")

  const [{ projects, count: countProjectsSelected }, { refetch: refetchProjects }] = useQuery(
    getProjects,
    {
      where: {
        tierName: selectedRowID,
      },
    }
  )

  const createNewTier = async (values) => {
    try {
      const tier = await createTierMutation(values)
      await refetch()
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1
        const savedRowValues = {
          id: tier.name,
          name: tier.name,
          benefits: tier.benefits,
          requisites: tier.requisites,
          goals: tier.goals,
        }
        return [...rows.slice(0, rowToDeleteIndex), savedRowValues]
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const editTierInfo = async (id: string, values: any) => {
    try {
      const updated = await updateTierMutation({
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
      const deleted = await deleteTierMutation({ name: selectedRowID })
      refetch()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
    setRows((prevRows) => {
      const rowToDeleteIndex = prevRows.findIndex((rowValue) => rowValue.id === selectedRowID)
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
    const newBenefits = idRef.api.getCellValue(id, "benefits")
    const newRequisites = idRef.api.getCellValue(id, "requisites")
    const newGoals = idRef.api.getCellValue(id, "goals")

    if (rows.find((rowValue) => rowValue.name === newName)) {
      console.error("Field Already exists")
      return
    } else {
      console.error("All fields are valid")
    }

    if (row.isNew && isValid) {
      const newValues = {
        name: newName,
        benefits: newBenefits,
        requisites: newRequisites,
        goals: newGoals,
      }
      idRef.api.setRowMode(id, "view")
      const resRowInsert = await createNewTier(newValues)
      return
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      await editTierInfo(id, {
        name: newName,
        benefits: newBenefits,
        requisites: newRequisites,
        goals: newGoals,
      })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
    }
  }

  const handleDeleteClick = (idRef) => {
    let id = idRef.row.id

    setSelectedRowID(() => id)
    setOpenDeleteModal(() => true)
  }

  const handleSubmit = async ({
    projectsIds,
    innovationTier,
  }: {
    projectsIds: string[]
    innovationTier: string
  }) => {
    await updateProjectTierMutation({
      ids: projectsIds,
      tierName: innovationTier,
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
    tiers.map((item) => ({
      id: item.name,
      name: item.name,
      benefits: item.benefits,
      requisites: item.requisites,
      goals: item.goals,
    }))
  )
  const columns = [
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "benefits", headerName: "Benefits", flex: 1, editable: true },
    { field: "requisites", headerName: "Requisites", flex: 1, editable: true },
    { field: "goals", headerName: "Goals", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      renderCell: (idRef: any) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit")
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
      <h2>Innovation Tiers</h2>
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
      {/* Confirmation for deletion */}
      <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>Choose the Innovation Tier to merge {selectedRowID} with </h2>
        <p>This action will delete {selectedRowID}</p>
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
            schema={UpdateProjectsInoovationTier}
            onSubmit={async (values) => {
              await handleSubmit({
                projectsIds: projects.map((project) => project.id),
                innovationTier: values.tierName.name,
              })
            }}
          >
            {isMergeAction && (
              <InputSelect
                valuesList={tiers.filter((tier) => tier.name !== selectedRowID)}
                defaultValue=""
                name="tierName"
                label="Innovation Tier to merge with"
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
export default InnovationTiersGrid
