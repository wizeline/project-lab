import { BlitzPage, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"
import CardBox from "app/core/components/CardBox"
import { Wrapper } from "../projects/projects.styles"

import { Box, Tabs } from "@mui/material"
import {
  TabStyles,
  EditPanelsStyles,
  TitleTabStyles,
  NavBarTabsStyles,
} from "app/projects/components/Styles/TabStyles.component"

import { SyntheticEvent, useState } from "react"
import TabPanel from "app/projects/components/TabPanel.component"
import LabelsDataGrid from "app/core/components/LabelsDataGrid"
import CategoryDataGrid from "app/core/components/CategoryDataGrid"
import ProjectStatusDataGrid from "app/core/components/ProjectStatusDataGrid"
import AdminsDataGrid from "app/core/components/AdminsDataGrid"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { adminRoleName } from "app/core/utils/constants"

const ManagerPage: BlitzPage = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)

  const [navTabIndex, setNavTabIndex] = useState(0)
  const handleNavTabChange = (event: SyntheticEvent, tabNumber: number) => setNavTabIndex(tabNumber)

  // eslint-disable-next-line no-unused-expressions
  user?.role !== adminRoleName && router.push("/")

  return (
    <div>
      <Header title="Manager" />
      <Wrapper className="homeWrapper">
        <NavBarTabsStyles>
          <EditPanelsStyles>
            <Tabs
              value={navTabIndex}
              onChange={handleNavTabChange}
              aria-label="Manage Admin NavBar"
            >
              <TitleTabStyles label="Filter Tags" />
              <TitleTabStyles label="Admin users" />
            </Tabs>
          </EditPanelsStyles>
        </NavBarTabsStyles>
        <TabPanel value={navTabIndex} index={0}>
          <CardBox title="Parameters">
            <EditPanelsStyles>
              <Box>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  aria-label="Manage Projects Attributes"
                >
                  <TabStyles label="Labels" />
                  <TabStyles label="Categories" />
                  <TabStyles label="Statuses" />
                </Tabs>
              </Box>
              <TabPanel value={tabIndex} index={0}>
                <LabelsDataGrid />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <CategoryDataGrid />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <ProjectStatusDataGrid />
              </TabPanel>
            </EditPanelsStyles>
          </CardBox>
        </TabPanel>
        <TabPanel value={navTabIndex} index={1}>
          <CardBox title="Admins">
            <AdminsDataGrid />
          </CardBox>
        </TabPanel>
      </Wrapper>
    </div>
  )
}
ManagerPage.authenticate = true
// ManagerPage.suppressFirstRenderFlicker = true
ManagerPage.getLayout = (page) => <Layout title={"Parameters"}>{page}</Layout>

export default ManagerPage
