import Compressor from 'compressorjs'
import toast from 'react-hot-toast'
import { useApp } from '../../contexts/AppContext'

export function ImageInput() {
  const { localImages } = useApp()

  function handleImages({ target }) {
    const files = target.files
    console.log(files)
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue

      let aux = file.name.split('.')
      let aux2 = aux.slice(0, aux.length - 1).join('.')

      const exist = localImages.exist(aux2)
      if (exist) {
        toast.error('La imagen ' + aux2 + ' ya existe')
        continue
      }

      new Compressor(file, {
        quality: 1,
        success: (compressed) => {
          const reader = new FileReader()
          reader.onload = () => {
            localImages.add({
              id: 'local-image-' + aux2 + (localImages.size + i + 1),
              originalName: aux2,
              URL: typeof reader.result === 'string' ? reader.result : '',
              file: compressed,
              size: compressed.size,
            })
          }
          reader.readAsDataURL(compressed)
        },
      })
    }
  }
  return (
    <div className="mx-5 text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
      <p className="text-lg font-medium mb-2 hidden sm:block">
        Arrastra aquí tus imagenes
      </p>
      <label
        htmlFor="upload-images"
        className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
      >
        Seleccionar Imagenes
      </label>
      <input
        className=" invisible w-full h-full border  absolute top-0 right-0"
        id="upload-images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImages}
      />
    </div>
  )
}
