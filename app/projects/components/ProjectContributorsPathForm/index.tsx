import { z } from "zod"
import { Field } from "react-final-form"
import { Form, FormProps } from "app/core/components/Form"
import { InstructionStyles } from "./ProjectContributorsPathForm.styles"
import StageInputs from "./StageInputs.component"
import uniqueId from "lodash.uniqueid"

export function ProjectContributorsPathForm<S extends z.ZodType<any, any>>({
  submitText,
  schema,
  initialValues,
  onSubmit,
  addNewStage,
}: FormProps<S>) {
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
          {({ input, meta }) => {
            const handleOnChange = (obj, key) => (evt) => {
              obj[key] = evt.target.value
              input.onChange(input.value)
            }

            return (
              <>
                {input.value.map((stage) => (
                  <StageInputs
                    key={stage.id || uniqueId()}
                    stage={stage}
                    handleOnChange={handleOnChange}
                    input={input}
                  />
                ))}
                <button type="button" onClick={addNewStage}>
                  Add Stage
                </button>
              </>
            )
          }}
        </Field>
      </Form>
    )
  }
  return null
}
