/* eslint-disable quotes */
import React from "react"
import styled from "@emotion/styled"
import { withStyles } from "@mui/styles"
import { Button as ButtonMaterial } from "@mui/material"

const RED = "hsl(3.3, 78.9%, 59%)"
const RED_HOVER = "#d33027"

export const Button = withStyles({
  root: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    textTransform: "none",
    backgroundColor: `${RED}`,
    "&:hover": {
      backgroundColor: `${RED_HOVER}`,
    },
  },
})(ButtonMaterial)

export const ButtonText = styled.button`
  background-color: transparent;
  font-size: 0.875rem;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 4px;
  margin: 0;
  border: 0;
  transition: 0.15s background-color ease-out;
  color: ${RED};
  &:hover {
    color: ${RED_HOVER};
    background-color: hsla(3.3, 78.9%, 59%, 0.04);
  }
`
