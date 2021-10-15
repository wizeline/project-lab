import { useState } from "react"
import { FormControlLabel, Switch, Collapse } from "@material-ui/core"

import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextFieldArea } from "app/core/components/LabeledTextFieldArea"
import { LabeledTextAreaField } from "app/core/components/LabeledTextAreaField"
import { CategorySelect } from "app/core/components/CategorySelect"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { LabelsSelect } from "app/core/components/LabelsSelect"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ProjectForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const { projectformType } = props
  const [displayFields, setDisplayFields] = useState(projectformType == "create" ? false : true)

  const handleDisplaySwitch = (e: any) => {
    console.log(`Change value of ${e.target.checked.toString()}`)
    setDisplayFields(!displayFields)
  }

  return (
    <Form<S> {...props} style={{ padding: "0 2em", margin: "0 auto" }}>
      <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />
      <LabeledTextFieldArea
        style={{ minHeight: "4em" }}
        fullWidth
        name="description"
        label="Problem Statement"
        placeholder="Problem statement"
      />
      {/* <LabeledTextAreaField
        style={{
          width: "96%",
          fontSize: "1em",
          padding: "1em",
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
        }}
        name="description"
        label="Problem statement"
        placeholder="How might we..."
      /> */}
      <LabeledTextAreaField
        style={{
          width: "96%",
          fontSize: "1em",
          padding: "1em",
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
        }}
        name="valueStatement"
        label="Your proposal"
        placeholder="Explain us your proposal"
      />

      {projectformType === "create" && (
        <FormControlLabel
          value="1"
          control={<Switch color="primary" onChange={handleDisplaySwitch} />}
          label="Add more details"
          labelPlacement="start"
        />
      )}

      <Collapse in={displayFields}>
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="target"
          label="Who is your target user/client"
          placeholder="Millenials"
        />
        <CategorySelect name="category" label="Category" />
        <SkillsSelect name="skills" label="Skills" />
        <LabelsSelect name="labels" label="Labels" />
        <ProjectMembersField name="projectMembers" label="Add a member" />
      </Collapse>
    </Form>
  )
}
