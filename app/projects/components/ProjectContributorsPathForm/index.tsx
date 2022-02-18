import { useState } from "react"
import { z } from "zod"
import { Field } from "react-final-form"
import { Form, FormProps } from "app/core/components/Form"
import {
  CollapsableHeader,
  InstructionStyles,
  LabelStyles,
  MultiColumnStyles,
  StageStyles,
  TextFieldStyles,
} from "./ProjectContributorsPathForm.styles"
import MarkdownEditor from "./ProjectContributorPathMarkdownEditor"
import { Button } from "@mui/material"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { SatelliteAlt } from "@mui/icons-material"

export function ProjectContributorsPathForm<S extends z.ZodType<any, any>>({
  submitText,
  schema,
  initialValues,
  onSubmit,
}: FormProps<S>) {
  const [open, setOpen] = useState(0)
  if (initialValues instanceof Array) {
    return (
      <Form<S>
        submitText={submitText}
        schema={schema}
        initialValues={{ stages: [...initialValues] }}
        onSubmit={onSubmit}
      >
        <InstructionStyles>
          * Fields marked with (markdown) have Markdown notation enabled:{" "}
          <a target="_blank" href="https://www.markdownguide.org/cheat-sheet/" rel="noreferrer">
            Basic Syntax
          </a>{" "}
          & line breaks
          <br />
          To add a new line break press the " &#9166; " (return) key twice from your keyboard.
        </InstructionStyles>
        <Field name="stages">
          {({ input }) => {
            const handleOnChange = (obj, key) => (evt) => {
              obj[key] = evt.target.value
              input.onChange(input.value)
            }
            return input.value.map((stage) => (
              <StageStyles key={stage.id}>
                <CollapsableHeader>
                  <h2>Stage {stage.position}</h2>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(stage.position === open ? 0 : stage.position)}
                  >
                    {stage.position === open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </CollapsableHeader>
                <Collapse in={open === stage.position} timeout="auto" unmountOnExit>
                  <MultiColumnStyles>
                    <TextFieldStyles
                      label="Name"
                      defaultValue={stage.name}
                      onChange={handleOnChange(stage, "name")}
                    ></TextFieldStyles>
                    {/* <TextFieldStyles
                    label="Position"
                    type="number"
                    defaultValue={stage.position}
                    onChange={handleOnChange(stage, "position")}
                    InputProps={{ inputProps: { min: 1, max: input.value.length } }}
                  ></TextFieldStyles> */}
                  </MultiColumnStyles>
                  <MarkdownEditor
                    label="Criteria"
                    defaultValue={stage.criteria}
                    onChange={handleOnChange(stage, "criteria")}
                  ></MarkdownEditor>
                  <MarkdownEditor
                    label="Mission"
                    defaultValue={stage.mission}
                    onChange={handleOnChange(stage, "mission")}
                  ></MarkdownEditor>
                  {stage.projectTasks ? (
                    <>
                      <LabelStyles>Tasks:</LabelStyles>
                      {stage.projectTasks.map((task) => (
                        <MarkdownEditor
                          key={task.id}
                          label="Description"
                          defaultValue={task.description}
                          onChange={handleOnChange(task, "description")}
                        ></MarkdownEditor>
                      ))}
                    </>
                  ) : null}
                </Collapse>
              </StageStyles>
            ))
          }}
        </Field>
      </Form>
    )
  }
  return null
}
