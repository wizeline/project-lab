import uniqueId from "lodash.uniqueid"

export const setHandleNewStage = (projectId, stagesArray, setStagesArray) => (input) => {
  const newStage = {
    projectId,
    id: uniqueId(),
    isNewStage: true,
    name: "",
    criteria: "",
    mission: "",
    position: stagesArray.length + 1,
    projectTasks: [
      {
        position: 1,
        description: "",
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
  input.value.push(newStage)
}

export const setHandleNewTask = (setStagesArray) => (stageToEdit) => {
  stageToEdit.projectTasks.push({
    position: stageToEdit.projectTasks.length + 1,
    description: "",
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

export const setHandleDeleteStage =
  (
    retrieveProjectInfo,
    stagesArray,
    setStagesArray,
    updateStageMutation,
    deleteProjectStageMutation
  ) =>
  async (stageToDelete) => {
    try {
      if (!stageToDelete.isNewStage) {
        const projectInfo = retrieveProjectInfo ? retrieveProjectInfo() : {}
        await deleteProjectStageMutation({ ...projectInfo, stageId: stageToDelete.id })
        // update other stages positions
        await updateStageMutation({
          ...projectInfo,
          stages: stagesArray
            .filter((stage) => !stage.isNewStage && stage.id !== stageToDelete.id)
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

export const setHandleDeleteTask =
  (
    retrieveProjectInfo,
    setStagesArray,
    deleteProjectTaskMutation,
    updateProjectTaskPositionMutation
  ) =>
  async (stage, taskToDelete) => {
    try {
      const projectTasks = stage.projectTasks.filter((task) => task.id !== taskToDelete.id)

      if (!taskToDelete.isNewTask) {
        const projectInfo = retrieveProjectInfo ? retrieveProjectInfo() : {}
        await deleteProjectTaskMutation({ ...projectInfo, projectTaskId: taskToDelete.id })
        await updateProjectTaskPositionMutation({
          ...projectInfo,
          projectTasks: stage.projectTasks.filter(
            (task) => !task.isNewTask && task.id !== taskToDelete.id
          ),
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
