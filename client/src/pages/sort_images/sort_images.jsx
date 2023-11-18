import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';

export function SortImages() {
  const { images, reorderImages } = useApp();
  console.log(images);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const oldIndex = images.findIndex((user) => user.id === active.id);
    const newIndex = images.findIndex((user) => user.id === over.id);
    return reorderImages(arrayMove(images, oldIndex, newIndex));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-3 py-2">
          {images.map((image, i) => (
            <Item key={i} image={image} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function Item({ image }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { URL, originalName } = image;
  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 flex justify-between items-center bg-slate-300 w-1/2"
    >
      <img
        src={URL}
        alt="a image"
        className={`w-[60px] aspect-square rounded-md object-cover`}
      />
      <p className="w-full text-gray-800 ml-3">{originalName}</p>
      <button
        className="w-7 h-7 hover:text-red-800 rounded-full hover:bg-gray-400/40"
        title="Eliminar"
      >
        <XMarkIcon />
      </button>
    </li>
  );
}
