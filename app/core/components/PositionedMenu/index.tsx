import React, { useState } from "react"
import { Menu, MenuItem } from "@material-ui/core"
import { DropdownMenu } from "./PositionedMenu.style"

interface IMenu {
  text: string
  callback?: object
}
interface Iprops {
  menuItems: IMenu[]
}

const PositionedMenu = (props: Iprops) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (callback) => {
    setAnchorEl(null)
    if (typeof callback === "function") callback()
  }

  return (
    <>
      <DropdownMenu onClick={handleClick}> . . . </DropdownMenu>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {props.menuItems.map((menuItem, index) => {
          return (
            <MenuItem onClick={() => handleClose(menuItem.callback)} key={index}>
              {menuItem.text}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default PositionedMenu
