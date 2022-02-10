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

const RESULTS_QUEUED = 100

// Tool bara elemento de edicion
// const EditToolbar = (props) => {
//   const { apiRef } = props

//   const handleClick = () => {
//     const id = "212121"
//     apiRef.current.updateRows([{ id, isNew: true }])
//     apiRef.current.setRowMode(id, "edit")
//     // Wait for the grid to render with the new row
//     setTimeout(() => {
//       apiRef.current.scrollToIndexes({
//         rowIndex: apiRef.current.getRowsCount() - 1,
//       })

//       apiRef.current.setCellFocus(id, "name")
//     })
//   }
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   )
// }

// EditToolbar.propTypes = {
//   apiRef: PropTypes.shape({
//     current: PropTypes.object.isRequired,
//   }).isRequired,
// }

// Button for submitting edition
const SomeButton = (puid) => {
  const [updateLabelMutation] = useMutation(updateLabel)
  const editLabelInfo = async (id: string, values: any) => {
    try {
      const update = await updateLabelMutation({
        id: id,
        ...values,
      })
      // await setQueryData(updated)
      console.log("Values were UPDATED for label")
      // router.push(Routes.ManagerPage())
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  // Handle updates of rows
  const manageEdition = async (puid: any) => {
    console.dir(puid)
    console.log(`Edit: ${puid.row.id}`)
    let id = puid.row.id
    // let newLabel = `${puid.row.name} - Edited`
    let newLabel = puid.row.name
    await editLabelInfo(id, { name: newLabel })
    console.log(`New Label Value: ${newLabel}`)
  }

  return (
    <strong>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => manageEdition(puid)}
        style={{ marginLeft: 16, backgroundColor: "#AF2E33" }}
      >
        Edit
      </Button>
    </strong>
  )
}

const LabelsDataGrid = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [createLabelMutation] = useMutation(createLabel)
  const [{ labels, hasMore }] = usePaginatedQuery(
    getLabels,
    {
      orderBy: { name: "asc" },
      skip: RESULTS_QUEUED * page,
      take: RESULTS_QUEUED,
    },
    { staleTime: 200, refetchInterval: 200 }
  )

  // const [{ labels }] = useQuery(getLabels, {
  //   orderBy: { name: "asc" },
  // })

  const [updateLabelMutation] = useMutation(updateLabel)
  const editLabelInfo = async (id: string, values: any) => {
    try {
      const updated = await updateLabelMutation({
        id: id,
        ...values,
      })
      // await setQueryData(updated)
      console.log("Values were UPDATED for label")
      // router.push(Routes.ManagerPage())
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
    // event.stopPropagation()
    // console.dir(id.api.getCellValue)
    id.api.setRowMode(id.row.id, "edit")
    console.dir(id)

    // apiRef.current.setRowMode(id, "edit")
  }
  // const handleSaveClick = (id) => async (event) => {
  //   event.stopPropagation()
  //   // Wait for the validation to run
  //   const isValid = await apiRef.current.commitRowChange(id)
  //   if (isValid) {
  //     apiRef.current.setRowMode(id, "view")
  //     const row = apiRef.current.getRow(id)
  //     apiRef.current.updateRows([{ ...row, isNew: false }])
  //   }
  // }
  const handleSaveClick = async (idRef) => {
    // event.stopPropagation()
    // Wait for the validation to run
    const isValid = await idRef.api.commitRowChange(idRef.row.id)
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id)
      let id = idRef.row.id
      let newLabel = idRef.api.getCellValue(id, "name")
      await editLabelInfo(id, { name: newLabel })
      idRef.api.updateRows([{ ...row, isNew: false }])
      idRef.api.setRowMode(id, "view")
      console.log(`New Label Value: ${newLabel}`)
      router.push(Routes.ManagerPage())
    }
  }

  const handleDeleteClick = (id) => (event) => {
    event.stopPropagation()
    apiRef.current.updateRows([{ id, _action: "delete" }])
  }

  // const handleCancelClick = (id) => (event) => {
  //   event.stopPropagation()
  //   apiRef.current.setRowMode(id, "view")

  //   const row = apiRef.current.getRow(id)
  //   if (row && row.isNew) {
  //     apiRef.current.updateRows([{ id, _action: "delete" }])
  //   }
  // }
  const handleCancelClick = (id) => {
    // event.stopPropagation()
    id.api.setRowMode(id.row.id, "view")

    // const row = apiRef.current.getRow(id)
    // if (row && row.isNew) {
    //   apiRef.current.updateRows([{ id, _action: "delete" }])
    // }
  }

  const rows: GridRowsProp = labels.map((item, key) => ({
    id: item.id,
    name: item.name,
    // edit: "delete",
  }))
  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: true },
    // {
    //   field: "edit",
    //   headerName: "Edition",
    //   width: 150,
    //   renderCell: SomeButton,
    // },

    {
      field: "actions",
      // type: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (id) => {
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
            {/* <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              // onClick={handleEditClick(id)}
              onClick={() => handleEditClick(id)}
              color="inherit"
            /> */}

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
      <div style={{ display: "flex", width: "100%", height: 300 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // apiRef={apiRef}
            rowsPerPageOptions={[4, 8, 12]}
            pageSize={4}
            editMode="row"
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            onCellFocusOut={handleCellFocusOut}
          />
        </div>
      </div>

      <h3>Create Label</h3>
      <LabelForm
        submitText="Create Label"
        onSubmit={async (values) => {
          try {
            const label = await createLabelMutation(values)
            console.log("Info was saved")
            router.push(Routes.ManagerPage())
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
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
