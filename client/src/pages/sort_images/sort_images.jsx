import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useApp } from "../../contexts/AppContext";
import { API } from "../../api_instance";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function SortImages() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { images, reorderImages, updateInfoImages } = useApp();
  const previus = useLoaderData();
  useEffect(() => {
    updateInfoImages(previus?.photos);
  }, []);

  const handleDragEnd = (event) => { // * Bug al ordenar enmtre varias fotos
    const { active, over } = event;
    const oldIndex = images.findIndex((user) => user.id === active.id);
    const newIndex = images.findIndex((user) => user.id === over.id);
    return reorderImages(arrayMove(images, oldIndex, newIndex));
  };

  async function submitBook() {
    await API.updateActiveClient(clientId);
    await API.finishUpload({
      clientId,
      photos_length: images.length,
    });
    toast.success("Book enviado con exito")
    navigate(0);
  }

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
      <div className="flex flex-col  items-center mt-2 gap-4 ">
        <span className="flex flex-col gap-10 justify-around items-center w-full">
          <button
            onClick={() =>
              API.addImgsIndex(images).then((res) => {
                console.log(images);
                if (res.data) {
                  toast.success("Se ordenaron las fotos");
                  navigate(0);
                }
              })
            }
            className="w-fit text-white border-2   cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
          >
            Guardar orden de las fotos
            <AdjustmentsHorizontalIcon className="w-6 aspect-square stroke-2" />
          </button>
          <section>
            <button
              id="finish"
              disabled={previus.canFinish ? false : true}
              onClick={submitBook}
              className="disabled:opacity-50 w-fit font-bold bg-green-600 text-white border-2 !self-end  cursor-pointer border-green-800 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
            >
              Finalizar y enviar Book
              <PaperAirplaneIcon className="w-6 aspect-square stroke-2" />
            </button>
            {!previus.canFinish && (
              <p className="absolute  text-red-500 w-fit mx-auto">
                Ordene todas las fotos primero
              </p>
            )}
          </section>
        </span>
        <h1 className="text-2xl my-4 text-white underline  w-fit p-0">
          Recuerde cerrar la ventana una vez haya finalizado!
        </h1>
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
    if (res.data) {
      toast.success(`Se elimino ${originalName}`);
      navigate(0);
    }
  }

  return (
    <div className="p-2 flex  items-center bg-slate-300 rounded ">
      <li
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="p-2 flex justify-around items-center bg-slate-300 rounded"
      >
        <span className="text-xl font-bold  rounded-full mr-1.5 md:mr-4">
          {index + 1}
        </span>
        <img
          src={URL}
          alt="image"
          className={`w-[60px] mr-auto aspect-square rounded-md object-cover`}
        />
        <p className="mr-auto  text-sm lg:text-xl text-gray-800 overflow-hidden overflow-ellipsis max-w-[60%] w-full ml-3">
          {originalName}
        </p>
       </li>
      <span className=" right-8 ml-auto">
        <button
          onClick={handleDelete}
          className="border-2 ml-auto border-black hover:border-red-600 w-8 h-8 md:w-12 md:h-12  md:mx-2 hover:text-red-800 rounded-full hover:bg-gray-400/40"
          title="Eliminar"
        >
          <XMarkIcon />
        </button>
      </span>
    </div>
  );
}
