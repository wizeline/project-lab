import { useQuery, useMutation, useParam } from "blitz"
import { useState, useEffect } from "react"

import { DataGrid } from "@mui/x-data-grid"
import { ThemeProvider } from "@mui/material/styles"
import Button from "@mui/material/Button"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import TextField from "@mui/material/TextField"
import AddIcon from "@mui/icons-material/Add"
const { formatInTimeZone } = require("date-fns-tz")
import { toast } from "react-toastify"

import MenteesField from "app/projects/components/MenteesField"
import themeWize from "app/core/utils/themeWize"
import getProjectMentors from "../../queries/getProjectMentors"
import getProjectMentees from "../../queries/getProjectMentees"
import updateProjectMentees from "../../mutations/updateProjectMentees"

interface iRow {
  id?: string
  name?: string
  email?: string
  mentees?: number
}

export function MentorshipTable() {
  const [error, setError] = useState<string>("")
  const projectId = useParam("projectId", "string") as string
  const [rows, setRows] = useState<iRow[]>([])
  const [mentees, setMentees] = useState({})
  const [updateProjectMenteesMutation, { isLoading }] = useMutation(updateProjectMentees)
  // first data fetching state
  const [rowsIni, { refetch: refetchRows }] = useQuery(
    getProjectMentors,
    { id: projectId },
    { refetchOnReconnect: false }
  )
  const [menteesIni, { refetch: refetchMentees }] = useQuery(getProjectMentees, { id: projectId })

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
    setMentees((prevState) => ({
      ...prevState,
      [mentorProfileId]: {
        ...prevState[mentorProfileId],
        [idx]: {
          ...prevState[mentorProfileId][idx],
          [type]: setNewCSTDate(value),
        },
      },
    }))
  }

  const handleUpdateMenteesNumber = (mentorInfo: iRow) => {
    setRows((prevState: iRow[]): iRow[] =>
      prevState.map((member) =>
        member.id === mentorInfo.id
          ? {
              ...member,
              mentees: (member.mentees || 0) + 1,
            }
          : member
      )
    )
  }

  const handleSubmitMenteesInfo = async () => {
    try {
      Object.keys(mentees).forEach((mentor) => {
        mentees[mentor].mentees = rows.find((row) => row.id === mentor)?.mentees || 1
      })
      await updateProjectMenteesMutation({ mentees, projectId })
      await refetchRows()
      await refetchMentees()

      toast.success("Changes saved successfully")
    } catch (error) {
      toast.error("Oops! Something's wrong")
      setError(error)
    }
  }

  useEffect(() => {
    if (menteesIni) {
      handleUpdateMentees(menteesIni)
    }
    return () => setMentees({})
  }, [menteesIni])

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

  // DataGrid columns
  const columns = [
    { field: "name", headerName: "Mentor Name", width: 200, editable: false },
    {
      field: "mentees",
      headerName: "Mentees number",
      width: 150,
      renderCell: (idRef: any) => {
        const mentorInfo = idRef.row
        return (
          <div style={{ width: "100%" }}>
            {mentorInfo.mentees}
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleUpdateMenteesNumber(mentorInfo)}
              size="small"
              style={{ marginLeft: "10px" }}
            >
              <AddIcon />
            </Button>
          </div>
        )
      },
    },
    {
      field: "menteesNames",
      headerName: "Mentees",
      width: 890,
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
              style={{ width: "450px" }}
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
          <ul
            style={{
              listStyle: "none",
              width: "100%",
              paddingTop: "30px",
            }}
          >
            {menteesFields.map((field, idx) => (
              <li key={`${mentorProfileId}-${idx}`} style={{ display: "flex" }}>
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
          minHeight: "70vh",
          paddingBottom: "50px",
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "center" }}>
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
              componentsProps={{
                toolbar: { setRows },
              }}
              getRowHeight={(params) => {
                return 90 * params.model.mentees
              }}
              autoHeight={true}
              style={{
                fontSize: "16px",
              }}
            />
            <Button
              color="primary"
              variant="contained"
              style={{ alignSelf: "center", marginTop: "10px" }}
              onClick={handleSubmitMenteesInfo}
              disabled={isLoading}
            >
              Update Mentors
            </Button>
          </ThemeProvider>
        </div>
      </div>
    </>
  )
}
