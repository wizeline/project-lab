import { useState, useEffect, PropsWithoutRef } from "react"
import { FormLabel, FormHelperText } from "@mui/material"
import { EditorStyles } from "./ProjectContributorsPathForm.styles"

interface IMarkdownEditor {
  label: string
  defaultValue: string
  onChange({}): void
}

export default function MarkdownEditor({
  label,
  defaultValue,
  onChange,
  ...props
}: IMarkdownEditor) {
  return (
    <div>
      <FormLabel>{label}:</FormLabel>
      <EditorStyles
        defaultValue={defaultValue}
        placeholder="For formatting your text using HTML markup hit the '/' (slash) character from your keyboard."
        onChange={(getValue) => onChange({ target: { value: getValue() } })}
      ></EditorStyles>
      <FormHelperText>
        <span style={{ fontSize: "x-small" }}>(markdown)</span>
      </FormHelperText>
    </div>
  )
}
