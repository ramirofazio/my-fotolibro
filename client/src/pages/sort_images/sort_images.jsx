import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import {
  PaperAirplaneIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { useApp } from '../../contexts/AppContext'
import { API } from '../../api_instance'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'

export function SortImages() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const { images, reorderImages, updateInfoImages } = useApp()
  const previus = useLoaderData()
  const [trySort, setTrySort] = useState(false)

  const handleDragEnd = (event) => {
    const { active, over } = event
    const oldIndex = images.findIndex((user) => user.id === active.id)
    const newIndex = images.findIndex((user) => user.id === over.id)
    if (trySort === false) setTrySort(true)
    return reorderImages(arrayMove(images, oldIndex, newIndex))
  }

  function submitBook() {
    return API.addImgsIndex(images)
      .then(() => API.updateActiveClient(clientId))
      .then(() =>
        API.finishUpload({
          clientId,
          photos_length: images.length,
        })
      )
      .then((result) => {
        setTimeout(() => navigate(0), 3000)
        return result
      })
      .catch((error) => {
        throw error
      })
  }

  async function handleDelete(image) {
    const { originalName, id, publicId } = image
    const res = await API.deleteSingleImg({ publicId, id })
    if (res.data) {
      toast.success(`Se elimino ${originalName}`)
      navigate(0)
    }
  }
  useEffect(() => {
    updateInfoImages(previus?.photos)
    if (!previus?.photos?.length) {
      toast.error('Uups, Imagenes no cargadas')
      navigate(`/client/${clientId}/upload_images`) // redirecciona directo a upload_images
    }
  }, [])

  return (
    <div className="touch-none w-[85%] ml-4 mr-auto">
      <h2 className="w-fit text-white text-xl mx-auto my-2">
        Guarde el orden deseado para las fotos abajo del todo 👇
      </h2>
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-3 py-2">
            {images.map((image, i) => (
              <Item
                key={image.id}
                image={image}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex flex-col   items-center mt-2 gap-4 ">
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.promise(API.addImgsIndex(images), {
                loading: 'Ordenando fotos.',
                success: 'Las imagenes fueron ordenadas',
                error: 'Algo salio mal, Intenta de nuevo',
              })
            }}
            className="w-fit text-white   cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
          >
            <AdjustmentsHorizontalIcon className="w-6 aspect-square stroke-2" />
            Ordenar y continuar mas tarde
          </button>
          <button
            id="finish"
            disabled={previus?.canFinish || trySort ? false : true}
            onClick={() => {
              setTrySort(true)
              toast.promise(submitBook(), {
                loading: 'Enviando Imagenes',
                success: 'Las imagenes fueron Enviadas',
                error: 'Algo salio mal, Intenta de nuevo',
              })
            }}
            className="relative disabled:opacity-50 w-fit font-bold bg-green-600 text-white border-2 !self-end  cursor-pointer border-green-800 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
          >
            Finalizar y enviar Book
            <PaperAirplaneIcon className="w-6 aspect-square stroke-2" />
            {!previus?.canFinish && !trySort && (
              <p className="absolute -bottom-12 sm:-bottom-6 right-0 text-red-500 w-fit mx-auto">
                Ordene todas las fotos primero
              </p>
            )}
          </button>
        </div>
        <p className="text-2xl my-5 text-white underline  w-fit p-0">
          Recuerde cerrar la ventana una vez haya finalizado!
        </p>
      </div>
    </div>
  )
}

function Item({ image, index, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { URL, originalName } = image

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[95%] flex bg-slate-300 rounded justify-between items-center"
    >
      <div className=" gap-2  p-2 flex items-center  ">
        <span className="text-xl font-bold  rounded-full mr-1.5 md:mr-4">
          {index + 1}
        </span>
        <img
          src={URL}
          alt="image"
          className={`w-[60px] mr-auto aspect-square rounded-md object-cover`}
        />
        <p className="mr-auto  text-sm lg:text-xl text-gray-800 overflow-hidden overflow-ellipsis max-w-[60%] w-[90%] ml-3">
          {originalName}
        </p>
      </div>
      <div className="flex gap-6 items-center pr-2">
        <button
          onClick={() => onDelete(image)}
          className="w-8 aspect-square md:w-10 text-gray-700 hover:text-red-600 rounded hover:bg-gray-400/40"
          title="Eliminar"
        >
          <XMarkIcon />
        </button>
        <button
          className="w-8 text-gray-700 hover:text-gray-800 hover:bg-gray-400/40 md:w-11 rounded h-12"
          {...attributes}
          {...listeners}
        >
          <ChevronUpDownIcon className=" w-full aspect-square" />
        </button>
      </div>
    </div>
  )
}
