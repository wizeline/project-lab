import React, { useEffect, useRef, useState } from "react"
import { ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import { DropdownPlaceholderContainer } from "./DropDownButton.styles"

export const DropDownButton = ({ children, options }) => {
  const [openActionsUser, setOpenActionsUser] = useState(false)
  const actionsUserRef = useRef<any>(null)

  const handleToggle = () => {
    setOpenActionsUser((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (actionsUserRef.current && actionsUserRef.current.contains(event.target)) {
      return
    }

    setOpenActionsUser(false)
  }

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault()
      setOpenActionsUser(false)
    }
  }

  // return focus to the button when we transitioned from !openActionsUser -> openActionsUser
  const prevOpen = useRef(openActionsUser)
  useEffect(() => {
    if (prevOpen.current === true && openActionsUser === false) {
      actionsUserRef.current.focus()
    }

    prevOpen.current = openActionsUser
  }, [openActionsUser])

  return (
    <div>
      <DropdownPlaceholderContainer ref={actionsUserRef} onClick={handleToggle}>
        {children}
        <ExpandMoreIcon fontSize="small" />
      </DropdownPlaceholderContainer>
      <div>
        <Popper
          open={openActionsUser}
          anchorEl={actionsUserRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {options.map((option, index) => {
                      const { onClick, text, ...otherOption } = option
                      return (
                        <MenuItem
                          {...otherOption}
                          onClick={(e) => {
                            handleClose(e)
                            onClick()
                          }}
                          key={index}
                        >
                          {text}
                        </MenuItem>
                      )
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
}

export default DropDownButton
