import { useState } from 'react';
import { XIcon } from '../upload_images/UploadImages';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function ShortImages() {
  const [users, setUser] = useState([
    { name: 'Goku', id: 'laj' },
    { name: 'Vegeta', id: 'ksz' },
    { name: 'jon Doe', id: 'dsd' },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const oldIndex = users.findIndex((user) => user.id === active.id);
    const newIndex = users.findIndex((user) => user.id === over.id);
    return setUser(arrayMove(users, oldIndex, newIndex));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={users} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-3">
          {users.map((user, i) => (
            <Item key={i} user={user} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function Item({ user }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: user.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 flex justify-between items-center bg-slate-300"
    >
      <img
        src="data:image/png;base64,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"
        alt="a image"
        className={` w-[60px] aspect-square rounded-full`}
      />
      {user.name}
      <button
        className="w-7 h-7 hover:text-red-800 rounded-full hover:bg-gray-400/40"
        title="Eliminar"
      >
        <XIcon />
      </button>
    </li>
  );
}
