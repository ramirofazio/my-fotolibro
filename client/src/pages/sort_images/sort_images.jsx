import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'

import { SortableItem } from './sort_item'

export function SortImages({ cloudImages, updateIndex, onRemove }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    const oldIndex = cloudImages.findIndex((user) => user.id === active.id)
    const newIndex = cloudImages.findIndex((user) => user.id === over.id)
    return updateIndex(arrayMove(cloudImages, oldIndex, newIndex))
  }

  return (
    <div className="my-5 px-6 min-h-[500px] overflow-hidden">
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cloudImages}
          strategy={verticalListSortingStrategy}
        >
          <ul className=" flex flex-col gap-3 py-2">
            {cloudImages.map((image, i) => (
              <SortableItem
                key={image.id}
                image={image}
                index={i}
                onDelete={() =>
                  onRemove(image.id, image.publicId, image.originalName)
                }
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
