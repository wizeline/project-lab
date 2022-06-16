import { useState } from "react"
import { useQuery } from "blitz"
import { FormControlLabel, Switch, Collapse, Checkbox } from "@mui/material"
import { z } from "zod"

import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextFieldArea } from "app/core/components/LabeledTextFieldArea"
import { InputSelect } from "app/core/components/InputSelect"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { DisciplinesSelect } from "app/core/components/DisciplinesSelect"
import { LabelsSelect } from "app/core/components/LabelsSelect"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"
import { ProjectOwnerField } from "app/core/components/ProjectOwnerField"
import TextEditor from "app/core/components/TextEditor"

import getCategories from "app/categories/queries/getCategories"
import getStatuses from "app/statuses/queries/getStatuses"
import { defaultCategory, defaultStatus, adminRoleName } from "app/core/utils/constants"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import getInnovationTiers from "app/innovationTiers/queries/getInnovationTiers"
import { LabeledSwitchField } from "app/core/components/LabeledSwitchField"
import MultiValueField from "app/core/components/MultivalueInput"

export { FORM_ERROR } from "app/core/components/Form"

export function ProjectForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const { projectformType, initialValues } = props
  const [displayFields, setDisplayFields] = useState(projectformType == "create" ? false : true)
  const [categories] = useQuery(getCategories, {})
  const [statuses] = useQuery(getStatuses, {})
  const [{ tiers }] = useQuery(getInnovationTiers, {})

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

  const user = useCurrentUser()

  return (
    <Form<S> {...props}>
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
      <LabeledSwitchField
        name="helpWanted"
        label="Help wanted"
        initialValues={initialValues ? initialValues.helpWanted : true}
      />

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
        <MultiValueField
          name="repoUrls"
          label="Repo URLs"
          footer="Type the Repo URL and press Enter to add it to your project. You can add as many URLs as you need."
        />
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="slackChannel"
          label="Slack Channel"
          placeholder="#project-name"
        />
        <InputSelect
          valuesList={categories}
          defaultValue={defaultCategory}
          name="category"
          label="Category"
          disabled={user?.role !== adminRoleName}
        />
        {projectformType !== "create" && (
          <InputSelect
            valuesList={statuses}
            defaultValue={defaultStatus}
            name="projectStatus"
            label="Status"
            disabled={user?.role !== adminRoleName}
          />
        )}
        <SkillsSelect name="skills" label="Skills" />
        <DisciplinesSelect name="disciplines" label="Looking for..." />
        <LabelsSelect name="labels" label="Labels" />
        {projectformType !== "create" && (
          <InputSelect
            valuesList={tiers}
            name="innovationTiers"
            label="Innovation Tier"
            disabled={user?.role !== adminRoleName}
          />
        )}
        <ProjectMembersField name="projectMembers" label="Add a contributor" />
      </Collapse>
    </Form>
  )
}
