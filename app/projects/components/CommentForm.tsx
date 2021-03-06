import { Box } from "@mui/material"
import { Form, FormProps } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"

import { z } from "zod"

export { FORM_ERROR } from "app/core/components/Form"

export function CommentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <Box sx={{ marginTop: 1 }}>
        <LabeledTextField style={{ width: "100%" }} name="comment" label="Write a comment" />
      </Box>
    </Form>
  )
}
