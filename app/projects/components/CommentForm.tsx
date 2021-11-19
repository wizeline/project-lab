import { Box } from "@material-ui/system"
import { Form, FormProps } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"

import { z } from "zod"

export { FORM_ERROR } from "app/core/components/Form"

export function CommentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <Box sx={{ marginTop: 1 }}>
        <LabeledTextField style={{ width: 940 }} name="body" multiline label="Write a comment" />
      </Box>
    </Form>
  )
}
