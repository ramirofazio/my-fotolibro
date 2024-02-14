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
import {
  PaperAirplaneIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { useApp } from '../../contexts/AppContext'
import { API } from '../../api_instance'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { SortableItem } from './sort_item'

export function SortImages() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const { images, reorderImages, updateInfoImages, removeImage } = useApp()
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

  console.log(images)
  useEffect(() => {
    updateInfoImages(previus?.photos)
    if (!previus?.photos?.length) {
      toast.error('Uups, Imagenes no cargadas')
      navigate(`/client/${clientId}/upload_images`) // redirecciona directo a upload_images
    }
  }, [])

  return (
    <div className=" w-[85%] ml-4 mr-auto">
      <h2 className="w-fit text-white text-xl mx-auto my-2">
        Guarde el orden deseado para las fotos abajo del todo 👇
      </h2>
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <ul className=" flex flex-col gap-3 py-2">
            {images.map((image, i) => (
              <SortableItem
                key={image.id}
                image={image}
                index={i}
                onDelete={removeImage}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex flex-col items-center mt-2 gap-4 ">
        <div className="flex flex-col items-center  md:items-start md:w-[90%] md:flex-row  gap-4 md:mr-auto">
          <button
            onClick={() => {
              toast.promise(API.addImgsIndex(images), {
                loading: 'Ordenando fotos.',
                success: 'Las imagenes fueron ordenadas',
                error: 'Algo salio mal, Intenta de nuevo',
              })
            }}
            className="w-full  text-white   cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center justify-center gap-2 "
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
            className="relative justify-center  disabled:opacity-50 w-full font-bold bg-green-600 text-white border-2  h-full  cursor-pointer border-green-800 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
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
        <p className="text-lg lg:text-2xl my-5 text-white underline  w-fit p-0">
          Recuerde cerrar la ventana una vez haya finalizado!
        </p>
      </div>
    </div>
  )
}
