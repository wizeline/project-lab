import styled from "@emotion/styled"
import Tab from "@mui/material/Tab"

export const TabStyles = styled(Tab)`
  text-transform: initial;
  background-color: #ebebeb;
  color: #1f1f1f;
  font-family: Poppins, sans-serif;
  font-weight: 600;
  margin-right: 1em;
  border-radius: 4px;
  border-color: transparent;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: 0.3s box-shadow ease-out;
  transition-delay: 1;

  &[aria-selected="true"] {
    background-color: #e94d44;
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14);
    transition-delay: 0;
  }
`

export const EditPanelsStyles = styled.div`
  margin-top: -1em;

  .MuiBox-root {
    margin-bottom: 2em;
  }
  .MuiTabs-root,
  .MuiTabs-scroller {
    overflow: visible;
  }
  .MuiTabs-indicator {
    visibility: hidden;
  }
`
