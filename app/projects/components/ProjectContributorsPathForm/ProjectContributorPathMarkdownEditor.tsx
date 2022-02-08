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
      <FormLabel required>{label}</FormLabel>
      <EditorStyles
        defaultValue={defaultValue}
        placeholder="For formatting your text using HTML markup hit the '/' (slash) character from your keyboard."
        onChange={(getValue) => onChange({ target: { value: getValue() } })}
      ></EditorStyles>
      <FormHelperText>
        To add a new line break press the " &#9166; " (return) key twice from your keyboard. You can
        also use the 'Markdown Basic Syntax' language inline{" "}
        <a target="_blank" href="https://www.markdownguide.org/cheat-sheet/" rel="noreferrer">
          Learn more about it here
        </a>
      </FormHelperText>
    </div>
  )
}
