import { useState } from "react"
import { useMutation } from "blitz"
import { z } from "zod"
import { Draggable } from "react-beautiful-dnd"
import { Field } from "react-final-form"
import uniqueId from "lodash.uniqueid"
import Collapse from "@mui/material/Collapse"
import FormStages, { FormStagesProps } from "./FormStages"
import MarkdownEditor from "./ProjectContributorPathMarkdownEditor"
import DragDropContainer from "../DragDropContainer"
import StageCollapsableHeader from "./StageCollapsableHeader"
import updateStages from "app/projects/mutations/updateStages"
import deleteProjectTask from "app/projects/mutations/deleteProjectTask"
import deleteProjectStage from "app/projects/mutations/deleteProjectStage"
import updateProjectTask from "app/projects/mutations/updateProjectTask"
import {
  InstructionStyles,
  LabelStyles,
  MultiColumnStyles,
  StageStyles,
  TextFieldStyles,
} from "./ProjectContributorsPathForm.styles"

// import StageInputs from "./StageInputs.component"
// import { Button } from "@mui/material"

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

  const assignNewPosition = (dragDropReordered) => {
    //This 'dragDropReordered' variable comes from inside the DragDropContainer, and it contains the RE-ORDERED array of elements
    //after the drag n drop action.
    dragDropReordered.map((stage: any, index: number) => {
      stage["position"] = index + 1
    })
  }

  const handleNewStage = () => {
    const newStage = {
      projectId,
      id: uniqueId(),
      isNewStage: true,
      name: "Test",
      criteria: "blah",
      mission: "blah",
      position: stagesArray.length + 1,
      projectTasks: [
        {
          position: 1,
          description: "blah",
          id: uniqueId(),
          isNewTask: true,
          projectStageId: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setStagesArray([...stagesArray, newStage])
  }

  const handleNewTask = (stageToEdit) => {
    stageToEdit.projectTasks.push({
      position: stageToEdit.projectTasks.length + 1,
      description: "blah",
      id: uniqueId(),
      isNewTask: true,
      projectStageId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    setStagesArray((prevStages) =>
      prevStages.map((prevStage) =>
        prevStage.id !== stageToEdit.id ? prevStage : { ...stageToEdit }
      )
    )
  }

  const handleDeleteStage = async (stageToDelete) => {
    try {
      if (!stageToDelete.isNewStage) {
        const projectInfo = retrieveProjectInfo ? retrieveProjectInfo() : {}
        await deleteProjectStageMutation({ ...projectInfo, stageId: stageToDelete.id })
        // update other stages positions
        await updateStageMutation({
          ...projectInfo,
          stages: stagesArray
            .filter((stage) => !stage.isNewStage)
            .map((stage, index) => ({ ...stage, position: index + 1 })),
        })
      }

      setStagesArray((prevStages) => {
        const filteredStages = prevStages.filter((prevStage) => prevStage.id !== stageToDelete.id)
        return filteredStages.map((stage, index) => ({
          ...stage,
          position: index + 1,
        }))
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteTask = async (stage, taskToDelete) => {
    try {
      const projectTasks = stage.projectTasks.filter((task) => task.id !== taskToDelete.id)

      if (!taskToDelete.isNewTask) {
        const projectInfo = retrieveProjectInfo ? retrieveProjectInfo() : {}
        await deleteProjectTaskMutation({ ...projectInfo, projectTaskId: taskToDelete.id })
        await updateProjectTaskPositionMutation({
          ...projectInfo,
          projectTasks: stage.projectTasks.filter((task) => !task.isNewTask),
        })
      }

      setStagesArray((prevStages) =>
        prevStages.map((prevStage) =>
          prevStage.id !== stage.id ? prevStage : { ...stage, projectTasks }
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  if (initialValues instanceof Array) {
    if (stagesArray.length === 0) {
      setStagesArray(initialValues)
    }

    return (
      <>
        <FormStages<S>
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

          <DragDropContainer
            dragItemsArray={stagesArray}
            functAfterReorder={assignNewPosition}
            onDragStartFunct={() => setOpenedStage(0)}
            setReorderedItems={setStagesArray}
          >
            <Field name="stages">
              {({ input }) => {
                const handleOnChange = (obj, key) => (evt) => {
                  obj[key] = evt.target.value
                  input.onChange(input.value)
                }

                return stagesArray.map((stage, index) => (
                  <Draggable key={stage.id} draggableId={stage.id} index={index}>
                    {(provided) => (
                      <StageStyles
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <StageCollapsableHeader
                          openedStage={openedStage}
                          position={stage.position}
                          setOpenedStage={setOpenedStage}
                        />
                        <Collapse in={openedStage === stage.position} timeout="auto" unmountOnExit>
                          <MultiColumnStyles>
                            <TextFieldStyles
                              label="Name"
                              defaultValue={stage.name}
                              onChange={handleOnChange(stage, "name")}
                            ></TextFieldStyles>
                            <button type="button" onClick={() => handleDeleteStage(stage)}>
                              Delete Stage
                            </button>
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
                              <div>
                                <LabelStyles>Tasks:</LabelStyles>
                                <button type="button" onClick={() => handleNewTask(stage)}>
                                  New Task
                                </button>
                              </div>
                              {stage.projectTasks.map((task) => (
                                <MultiColumnStyles key={task.id}>
                                  <MarkdownEditor
                                    label="Description"
                                    defaultValue={task.description}
                                    onChange={handleOnChange(task, "description")}
                                  ></MarkdownEditor>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTask(stage, task)}
                                  >
                                    Delete Task
                                  </button>
                                </MultiColumnStyles>
                              ))}
                            </>
                          ) : null}
                        </Collapse>
                      </StageStyles>
                    )}
                  </Draggable>
                ))
              }}
            </Field>
          </DragDropContainer>

          <Field name="stagesToDelete" component="input" type="hidden" />

          <button type="button" onClick={handleNewStage}>
            Add Stage
          </button>
        </FormStages>
      </>
    )
  }
  return null
}
