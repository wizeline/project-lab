import { useState } from "react"
import { FormControlLabel, Switch, Collapse } from "@material-ui/core"
import { z } from "zod"

import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextFieldArea } from "app/core/components/LabeledTextFieldArea"
import { CategorySelect } from "app/core/components/CategorySelect"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { LabelsSelect } from "app/core/components/LabelsSelect"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"
import { ProjectStatusSelect } from "app/core/components/ProjectStatusSelect"
import { ProjectOwnerField } from "app/core/components/ProjectOwnerField"
import TextEditor from "app/core/components/TextEditor"

export { FORM_ERROR } from "app/core/components/Form"

export function ProjectForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const { projectformType, initialValues } = props
  const [displayFields, setDisplayFields] = useState(projectformType == "create" ? false : true)

  const handleDisplaySwitch = (e: any) => {
    console.log(`Change value of ${e.target.checked.toString()}`)
    setDisplayFields(!displayFields)
  }

  const getOwner = (initialValues) => {
    const data = initialValues.owner
    return {
      profileId: data.id,
      name: `${data.firstName} ${data.lastName}`,
    }
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
      <TextEditor
        initialValues={initialValues}
        name="valueStatement"
        label="Your proposal"
        placeholder="Explain us your proposal..."
      ></TextEditor>

      {projectformType === "create" && (
        <FormControlLabel
          value="1"
          control={<Switch color="primary" onChange={handleDisplaySwitch} />}
          label="Add more details"
          labelPlacement="start"
        />
      )}
      {projectformType !== "create" && (
        <ProjectOwnerField name="owner" label="Owner" owner={getOwner(initialValues)} />
      )}
      <Collapse in={displayFields}>
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="target"
          label="Who is your target user/client"
          placeholder="Millenials"
        />
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="repoUrl"
          label="Repo URL"
          placeholder="https://github.com"
        />
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="slackChannel"
          label="Slack Channel"
          placeholder="#project-name"
        />
        <CategorySelect name="category" label="Category" />
        {projectformType != "create" && <ProjectStatusSelect name="projectStatus" label="Status" />}
        <SkillsSelect name="skills" label="Skills" />
        <LabelsSelect name="labels" label="Labels" />
        <ProjectMembersField name="projectMembers" label="Add a member" />
      </Collapse>
    </Form>
  )
}
