import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Header from "app/core/layouts/Header"
import CardBox from "app/core/components/CardBox"
import Wrapper from "../projects/projects.styles"

import { Box, Tabs } from "@mui/material"
import { TabStyles, EditPanelsStyles } from "app/projects/components/Styles/TabStyles.component"

import { SyntheticEvent, useState } from "react"
import TabPanel from "app/projects/components/TabPanel.component"
import LabelsDataGrid from "app/core/components/LabelsDataGrid"
import CategoryDataGrid from "app/core/components/CategoryDataGrid"
import ProjectStatusDataGrid from "app/core/components/ProjectStatusDataGrid"

const ManagerPage: BlitzPage = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)
  return (
    <div>
      <Header title="Manager" />
      <Wrapper className="homeWrapper">
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
      </Wrapper>
    </div>
  )
}
ManagerPage.authenticate = true
// ManagerPage.suppressFirstRenderFlicker = true
ManagerPage.getLayout = (page) => <Layout title={"Parameters"}>{page}</Layout>

export default ManagerPage
