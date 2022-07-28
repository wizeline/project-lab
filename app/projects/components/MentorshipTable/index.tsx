import { useQuery, useMutation, useParam, useRouter } from "blitz"
import { useState, useEffect } from "react"

import { DataGrid } from "@mui/x-data-grid"
import { ThemeProvider } from "@mui/material/styles"
import Button from "@mui/material/Button"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import TextField from "@mui/material/TextField"
const { formatInTimeZone } = require("date-fns-tz")

import MenteesField from "app/projects/components/MenteesField"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import themeWize from "app/core/utils/themeWize"
import getProjectMentors from "../../queries/getProjectMentors"
import getProjectMentees from "../../queries/getProjectMentees"
import updateProjectMentees from "../../mutations/updateProjectMentees"
import { adminRoleName } from "app/core/utils/constants"

interface iRow {
  id?: string
  name?: string
  email?: string
  mentees?: number
}

export function MentorshipTable() {
  const user = useCurrentUser()
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const projectId = useParam("projectId", "string") as string
  const [rows, setRows] = useState<iRow[]>([])
  const [mentees, setMentees] = useState({})
  const [updateProjectMenteesMutation] = useMutation(updateProjectMentees)

  // util functions
  const handleUpdateRows = (data) => {
    setRows(
      data.map((item) => ({
        id: item.profileId,
        name: `${item.profile?.firstName} ${item.profile?.lastName}`,
        email: item.profile?.email,
        mentees: item.mentees,
      }))
    )
  }

  const handleUpdateMentees = (data) => {
    setMentees(data)
  }

  const setNewCSTDate = (date) => formatInTimeZone(date, "CST6CDT", "MM/dd/yyyy")

  // update selected Mentee
  const handleChangeMentees = (idx, value, mentorProfileId) => {
    const newValue = mentees[mentorProfileId] || {}
    if (value === null) {
      newValue[idx] = null
    } else {
      newValue[idx] =
        newValue && newValue[idx]?.startDate
          ? { ...newValue[idx], ...value }
          : {
              ...value,
              startDate: setNewCSTDate(new Date()),
              endDate: setNewCSTDate(new Date()),
            }
    }
    setMentees((prevValues) => ({
      ...prevValues,
      [mentorProfileId]: newValue,
    }))
  }

  // Update start and/or end date to the mentee
  const handleDate = (type, idx, value, mentorProfileId) => {
    setMentees((prevValues) => ({
      ...prevValues,
      [mentorProfileId]: {
        ...prevValues[mentorProfileId],
        [idx]: {
          ...prevValues[mentorProfileId][idx],
          [type]: setNewCSTDate(value),
        },
      },
    }))
  }

  // first data fetching state
  const [rowsIni] = useQuery(getProjectMentors, { id: projectId })

  const [meteesIni] = useQuery(getProjectMentees, { id: projectId })

  useEffect(() => {
    if (meteesIni) {
      handleUpdateMentees(meteesIni)
    }
    return () => setMentees({})
  }, [meteesIni])

  useEffect(() => {
    if (rowsIni) {
      handleUpdateRows(rowsIni)
    }
    return () => setRows([])
  }, [rowsIni])

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

  const handleSaveClick = async () => {
    try {
      updateProjectMenteesMutation({ mentees, projectId })

      router.push(`/projects/${projectId}`)
    } catch (error) {
      setError(error)
    }
  }

  // DataGrid columns
  const columns = [
    { field: "email", headerName: "Mentor Email", width: 250, editable: false },
    { field: "name", headerName: "Mentor Name", width: 200, editable: false },
    { field: "mentees", headerName: "Mentees number", width: 150, editable: false },
    {
      field: "menteesNames",
      headerName: "Mentees",
      width: 600,
      renderCell: (idRef: any) => {
        const mentorProfileId = idRef.row.id
        idRef.api.setRowMode(mentorProfileId, "edit")

        // Add all the mentees fields based on the mentees number
        let menteesFields = [] as JSX.Element[]
        for (let i = 0; i < idRef.row.mentees; i++) {
          menteesFields.push(
            <MenteesField
              onChange={handleChangeMentees}
              idx={i}
              inputValue={mentees[mentorProfileId] ? mentees[mentorProfileId][i] : null}
              fullWidth={true}
              label="Mentee Name..."
              mentorProfileId={mentorProfileId}
            />
          )
        }

        const datePickerOptions = [
          {
            name: "Start Date",
            field: "startDate",
          },
          {
            name: "End Date",
            field: "endDate",
          },
        ]

        return (
          <ul style={{ listStyle: "none", width: "100%" }}>
            {menteesFields.map((field, idx) => (
              <li key={`${mentorProfileId}-${idx}`}>
                {field}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {datePickerOptions.map((datePicker) => (
                    <DatePicker
                      key={datePicker.field}
                      label={datePicker.name}
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => (
                        <TextField {...params} style={{ width: "150px", padding: "0 10px 25px" }} />
                      )}
                      value={
                        mentees[mentorProfileId] && mentees[mentorProfileId][idx]
                          ? mentees[mentorProfileId][idx][datePicker.field]
                          : undefined
                      }
                      onChange={(newVal) =>
                        handleDate(datePicker.field, idx, newVal, mentorProfileId)
                      }
                      disabled={!(mentees[mentorProfileId] && mentees[mentorProfileId][idx])}
                    />
                  ))}
                </LocalizationProvider>
              </li>
            ))}
          </ul>
        )
      },
    },
  ]

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "70vh",
          paddingBottom: "50px",
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "center" }}>
          <ThemeProvider theme={themeWize}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <DataGrid
              rows={rows}
              columns={columns}
              rowsPerPageOptions={[5]}
              pageSize={5}
              editMode="row"
              onRowEditStart={handleRowEditStart}
              onRowEditStop={handleRowEditStop}
              onCellFocusOut={handleCellFocusOut}
              componentsProps={{
                toolbar: { user },
              }}
              getRowHeight={(params) => {
                return 180 * params.model.mentees
              }}
            />
            <Button
              color="primary"
              variant="contained"
              style={{ alignSelf: "center", marginTop: "10px" }}
              onClick={handleSaveClick}
            >
              Update Mentors
            </Button>
          </ThemeProvider>
        </div>
      </div>
    </>
  )
}
