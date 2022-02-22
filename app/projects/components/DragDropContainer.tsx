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

    result.map((stage: any, index: number) => {
      stage["position"] = index + 1
    })

    return result
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const reorderedItems = reorder(dragItemsArray, result.source.index, result.destination.index)
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
