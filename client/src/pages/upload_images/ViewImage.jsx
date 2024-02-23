import { XMarkIcon } from '@heroicons/react/24/outline'
import { getSizeImage } from '../../utils'

export function ViewImage({ URL, inCloud, size, onRemove }) {
  return (
    <div className="relative w-fit rounded overflow-hidden">
      <img
        src={URL}
        alt="a image"
        className="w-[500px] aspect-square object-cover"
      />
      <div
        className={`absolute top-0 left-0 w-full p-1 flex justify-between items-center bg-gradient-to-b ${
          !inCloud ? 'from-black/70' : 'from-green-800/70'
        } to-transparent`}
      >
        <div className="flex gap-2 items-center">
          <p className="flex flex-col line-clamp-1">
            <span className="text-sm font-medium">
              {!inCloud ? 'Pendiente' : 'Imagen Subida'}
            </span>
            <span className="text-[12px] text-gray-200">
              {getSizeImage(size)}
            </span>
          </p>
        </div>
        <button
          onClick={onRemove}
          className="w-7 aspect-square p-0.5 hover:text-red-800 text-gray-700 rounded-full bg-gray-400/40  hover:bg-gray-400 "
          title="Eliminar"
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
  )
}
