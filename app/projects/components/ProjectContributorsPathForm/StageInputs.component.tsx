import { Fragment } from "react"
import MarkdownEditor from "./ProjectContributorPathMarkdownEditor"
import {
  LabelStyles,
  MultiColumnStyles,
  StageStyles,
  TextFieldStyles,
} from "./ProjectContributorsPathForm.styles"

export default function StageInputs({ stage, handleOnChange, input }) {
  const addNewTask = () => {
    const newTask = {
      position: stage.projectTasks.length + 1,
      description: "blah",
      id: "",
      projectStageId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    stage.projectTasks.push(newTask)

    input.onChange(input.value)

    console.log("projectTasks", stage.projectTasks)
  }

  return (
    <StageStyles>
      <MultiColumnStyles>
        <TextFieldStyles
          label="Name"
          defaultValue={stage.name}
          onChange={handleOnChange(stage, "name")}
        ></TextFieldStyles>
        <TextFieldStyles
          label="Position"
          type="number"
          defaultValue={stage.position}
          onChange={handleOnChange(stage, "position")}
          InputProps={{ inputProps: { min: 1, max: input.value.length } }}
        ></TextFieldStyles>
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
          <button type="button" onClick={addNewTask}>
            Add a new task
          </button>
          {stage.projectTasks.map((task) => (
            <Fragment key={task.id}>
              <MarkdownEditor
                label="Description"
                defaultValue={task.description}
                onChange={handleOnChange(task, "description")}
              ></MarkdownEditor>
              <TextFieldStyles
                label="Position"
                type="number"
                defaultValue={task.position}
                onChange={handleOnChange(task, "position")}
                InputProps={{ inputProps: { min: 1, max: stage.projectTasks.length } }}
              ></TextFieldStyles>
            </Fragment>
          ))}
        </>
      ) : null}
    </StageStyles>
  )
}
