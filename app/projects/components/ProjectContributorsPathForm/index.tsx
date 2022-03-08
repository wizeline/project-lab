import { useState } from "react"
import { useMutation } from "blitz"
import { z } from "zod"
import { Draggable } from "react-beautiful-dnd"
import { Field } from "react-final-form"
import Collapse from "@mui/material/Collapse"
import FormStages, { FormStagesProps } from "./FormStages"
import MarkdownEditor from "./ProjectContributorPathMarkdownEditor"
import DragDropContainer from "../DragDropContainer"
import StageCollapsableHeader from "./StageCollapsableHeader"
import updateStages from "app/projects/mutations/updateStages"
import deleteProjectTask from "app/projects/mutations/deleteProjectTask"
import deleteProjectStage from "app/projects/mutations/deleteProjectStage"
import updateProjectTask from "app/projects/mutations/updateProjectTask"
import { Button, ButtonText } from "app/core/components/Button"
import {
  setHandleDeleteStage,
  setHandleDeleteTask,
  setHandleNewStage,
  setHandleNewTask,
} from "./ProjectContributorsPathEditHelpers"
import {
  InstructionStyles,
  LabelStyles,
  MultiColumnStyles,
  LabelWithButtonDivStyles,
  StageStyles,
  TextFieldStyles,
} from "./ProjectContributorsPathForm.styles"

//This 'dragDropReordered' variable comes from inside the DragDropContainer,
// and it contains the RE-ORDERED array of elements
//after the drag n drop action.
const assignNewPosition = (dragDropReordered): void => {
  dragDropReordered.map((stage: any, index: number) => (stage["position"] = index + 1))
}

export function ProjectContributorsPathForm<S extends z.ZodType<any, any>>({
  submitText,
  schema,
  initialValues,
  onSubmit,
  projectId,
  retrieveProjectInfo,
}: FormStagesProps<S>) {
  const [openedStage, setOpenedStage] = useState(0)
  const [stagesArray, setStagesArray] = useState<any[]>([])

  const [updateStageMutation] = useMutation(updateStages)
  const [deleteProjectTaskMutation] = useMutation(deleteProjectTask)
  const [deleteProjectStageMutation] = useMutation(deleteProjectStage)
  const [updateProjectTaskPositionMutation] = useMutation(updateProjectTask)

  const handleNewStage = setHandleNewStage(projectId, stagesArray, setStagesArray)

  const handleNewTask = setHandleNewTask(setStagesArray)

  const handleDeleteStage = setHandleDeleteStage(
    retrieveProjectInfo,
    stagesArray,
    setStagesArray,
    updateStageMutation,
    deleteProjectStageMutation
  )

  const handleDeleteTask = setHandleDeleteTask(
    retrieveProjectInfo,
    setStagesArray,
    deleteProjectTaskMutation,
    updateProjectTaskPositionMutation
  )

  if (initialValues instanceof Array) {
    if (stagesArray.length === 0) {
      setStagesArray(initialValues)
    }

    return (
      <FormStages<S>
        submitText={submitText}
        schema={schema}
        initialValues={{ stages: [...stagesArray] }}
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

            return (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  tabIndex={-1}
                  type="button"
                  onClick={() => handleNewStage(input)}
                >
                  Add new Stage
                </Button>

                <DragDropContainer
                  dragItemsArray={stagesArray}
                  functAfterReorder={assignNewPosition}
                  onDragStartFunct={() => setOpenedStage(0)}
                  setReorderedItems={setStagesArray}
                >
                  {stagesArray.map((stage, index) => (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided) => (
                        <StageStyles
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <StageCollapsableHeader
                            name={stage.name}
                            openedStage={openedStage}
                            position={stage.position}
                            setOpenedStage={setOpenedStage}
                          />
                          <Collapse
                            in={openedStage === stage.position}
                            timeout="auto"
                            unmountOnExit
                          >
                            <MultiColumnStyles>
                              <TextFieldStyles
                                label="Name"
                                defaultValue={stage.name}
                                onChange={handleOnChange(stage, "name")}
                                required
                              ></TextFieldStyles>
                              <ButtonText
                                tabIndex={-1}
                                type="button"
                                onClick={() => handleDeleteStage(stage)}
                              >
                                Delete Stage
                              </ButtonText>
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
                                <LabelWithButtonDivStyles>
                                  <LabelStyles>Tasks:</LabelStyles>
                                  <ButtonText
                                    tabIndex={-1}
                                    type="button"
                                    onClick={() => handleNewTask(stage)}
                                  >
                                    Add new Task
                                  </ButtonText>
                                </LabelWithButtonDivStyles>
                                {stage.projectTasks.map((task) => (
                                  <MultiColumnStyles key={task.id}>
                                    <MarkdownEditor
                                      label="Description"
                                      defaultValue={task.description}
                                      onChange={handleOnChange(task, "description")}
                                    ></MarkdownEditor>
                                    <ButtonText
                                      tabIndex={-1}
                                      type="button"
                                      onClick={() => handleDeleteTask(stage, task)}
                                    >
                                      Delete Task
                                    </ButtonText>
                                  </MultiColumnStyles>
                                ))}
                              </>
                            ) : null}
                          </Collapse>
                        </StageStyles>
                      )}
                    </Draggable>
                  ))}
                </DragDropContainer>
              </>
            )
          }}
        </Field>
      </FormStages>
    )
  }
  return null
}
