/* eslint-disable quotes */
import React from "react"
import styled from "@emotion/styled"
import { Button as ButtonMaterial } from "@mui/material"

const RED = "hsl(3.3, 78.9%, 59%)"
const RED_HOVER = "hsl(3.3, 68%, 52%)"

export const Button = styled(ButtonMaterial)`
  font-family: "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto",
    "Helvetica Neue", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  text-transform: none;
  background-color: ${RED};

  &:hover {
    background-color: ${RED_HOVER};
  }
`

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
