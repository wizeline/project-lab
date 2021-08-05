import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextAreaField } from "app/core/components/LabeledTextAreaField"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { LabelsSelect } from "app/core/components/LabelsSelect"
import { ProjectMembersField } from "app/core/components/ProjectMembersField"

import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ProjectForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextAreaField
        name="description"
        label="Problem statement"
        placeholder="How might we..."
      />
      <LabeledTextAreaField
        name="valueStatement"
        label="Your proposal"
        placeholder="Explain us your proposal"
      />
      <LabeledTextField
        name="target"
        label="Who is your target user/client"
        placeholder="Millenials"
      />
      <SkillsSelect name="skills" label="Skills" />
      <LabelsSelect name="labels" label="Labels" />
      <ProjectMembersField name="projectMembers" label="Add a member" />
    </Form>
  )
}
