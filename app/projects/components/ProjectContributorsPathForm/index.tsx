import { z } from "zod"
import { Field } from "react-final-form"
import { Form, FormProps } from "app/core/components/Form"
import { StageStyles, TextFieldStyles } from "./ProjectContributorsPathForm.styles"
import MarkdownEditor from "./ProjectContributorPathMarkdownEditor"

export function ProjectContributorsPathForm<S extends z.ZodType<any, any>>({
  submitText,
  schema,
  initialValues,
  onSubmit,
}: FormProps<S>) {
  if (initialValues instanceof Array) {
    return (
      <Form<S>
        submitText={submitText}
        schema={schema}
        initialValues={{ stages: [...initialValues] }}
        onSubmit={onSubmit}
      >
        <Field name="stages">
          {({ input }) => {
            const handleOnChange = (obj, key) => (evt) => {
              obj[key] = evt.target.value
              input.onChange(input.value)
            }
            return input.value.map((stage) => (
              <StageStyles key={stage.id}>
                <TextFieldStyles
                  label="Position"
                  size="small"
                  type="number"
                  defaultValue={stage.position}
                  onChange={handleOnChange(stage, "position")}
                ></TextFieldStyles>
                <TextFieldStyles
                  label="Name"
                  defaultValue={stage.name}
                  onChange={handleOnChange(stage, "name")}
                  fullWidth
                ></TextFieldStyles>
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
              </StageStyles>
            ))
          }}
        </Field>
      </Form>
    )
  }
  return null
}
