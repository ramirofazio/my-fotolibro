import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useApp } from "../../contexts/AppContext";
import { API } from "../../api_instance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {toast} from "react-hot-toast"

export function SortImages() {
  const { images, reorderImages, updateInfoImages } = useApp();
  const previus = useLoaderData();
  useEffect(() => {
    updateInfoImages(previus.photos);
  }, []);
  console.log(previus);
  console.log(images);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    const oldIndex = images.findIndex((user) => user.id === active.id);
    const newIndex = images.findIndex((user) => user.id === over.id);
    return reorderImages(arrayMove(images, oldIndex, newIndex));
  };

  return (
    <div className="touch-none w-[85%] mx-auto">
      <div className="flex  flex-col justify-center items-center text-white mt-4 mb-4">
        <h2 className="font-semibold text-2xl">Ordena tus fotos!</h2>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-3 py-2">
            {images.map((image, i) => (
              <Item key={i} image={image} index={i} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => API.addImgsIndex(images).then(res => {
            if(res.data) {
              toast.success("Se ordenaron las fotos")
            }
          })}
          className="w-fit text-white  cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
        >
          Guardar orden de las fotos
          <PaperAirplaneIcon className="w-6 aspect-square stroke-2" />
        </button>
      </div>
    </div>
  );
}

function Item({ image, index }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { URL, originalName, id, publicId } = image;

  async function handleDelete() {
    const res = await API.deleteSingleImg({ publicId, id });
    if(res.data) {
      toast.success(`Se elimino ${originalName}`)
      navigate(0)
    }
  }

  return (
    <div className="p-2 flex justify-between items-center bg-slate-300 rounded">
      <li
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="p-2 flex justify-between items-center bg-slate-300 rounded"
      >
        <span className="text-xl font-bold  rounded-full mr-4">
          {index + 1}
        </span>
        <img
          src={URL}
          alt="image"
          className={`w-[60px] aspect-square rounded-md object-cover`}
        />
        <p className="w-full text-gray-800 ml-3">{originalName}</p>
      </li>
      <button
        onClick={handleDelete}
        className="border-2 border-black hover:border-red-600 w-12 h-12 mx-2 hover:text-red-800 rounded-full hover:bg-gray-400/40"
        title="Eliminar"
      >
        <XMarkIcon />
      </button>
    </div>
  );
}
