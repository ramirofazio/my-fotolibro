import { useSortable } from '@dnd-kit/sortable'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CSS } from '@dnd-kit/utilities'

export function SortableItem({ image, index, onDelete, isLoading }) {
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
      className="w-[92%] mx-auto  flex bg-slate-300 rounded justify-between items-center"
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
        <p className="mr-auto md:hidden block   text-sm lg:text-xl text-gray-800 overflow-hidden overflow-ellipsis max-w-[60%] w-[90%] ml-3">
          {originalName.length < 15
            ? originalName
            : `${originalName.slice(0, 15)} ...`}
        </p>
        <p className=" hidden md:block text-sm lg:text-xl text-gray-800 overflow-hidden overflow-ellipsis  w-[90%] ml-3">
          {originalName}
        </p>
      </div>
      <div className="flex gap-2 md:gap-6 items-center pr-2">
        {!isLoading ? (
          <>
            <button
              onClick={onDelete}
              className="w-8 aspect-square md:w-10 text-gray-700 hover:text-red-600 rounded hover:bg-gray-400/40"
              title="Eliminar"
            >
              <XMarkIcon />
            </button>
            <button
              className="w-8 touch-none text-gray-700 hover:text-gray-800 hover:bg-gray-400/40 md:w-11 rounded h-12"
              {...attributes}
              {...listeners}
            >
              <ChevronUpDownIcon className=" w-full aspect-square" />
            </button>
          </>
        ) : (
          <CardLoader />
        )}
      </div>
    </div>
  )
}

export function CardLoader() {
  return (
    <>
      <div className="flex flex-row gap-2 px-2">
        <div className="w-4 h-4 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
        <div className="w-4 h-4 rounded-full bg-gray-500 animate-bounce [animation-delay:.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
      </div>
    </>
  )
}
