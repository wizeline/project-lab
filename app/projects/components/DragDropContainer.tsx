import React from "react"

import { DragDropContext, Droppable } from "react-beautiful-dnd"

interface IProps {
  dragItemsArray: Array<any>
  setReorderedItems(arg1): void
  children: React.ReactNode
}

function DragDropContainer({ dragItemsArray, setReorderedItems, children }: IProps) {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result) => {
    // Ask where is the 'input' variable obtained from, whats the difference between 'input' and 'initialValues' variables in ProjectContributorsForm
    //At the end, try to use the 'input' var and 'onDragEnd' CHANGE all the indexes: obj['position'] = newPos
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const reorderedItems = reorder(dragItemsArray, result.source.index, result.destination.index)
    console.log(reorderedItems)
    setReorderedItems(reorderedItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragDropContainer
