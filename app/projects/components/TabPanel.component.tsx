import { ReactNode } from "react"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}
