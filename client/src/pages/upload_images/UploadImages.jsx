import { useLoaderData, useParams } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getSizeImage, uploadImagesCloudinary } from '../../utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { API } from '../../api_instance'
import Compressor from 'compressorjs'
import { Loader } from '../../components/Loader'
import { useNavigation } from '../../contexts/NavigationContext'

export function UploadImages() {
  const { setStepContinue } = useNavigation()

  const { clientId } = useParams()
  const {
    images,
    addImages,
    removeImages,
    addImagesUploaded,
    status,
    existImage,
    updateInfoImages,
  } = useApp()
  const [Loading, setLoading] = useState(false)

  const previus = useLoaderData()
  useEffect(() => {
    updateInfoImages(previus.photos)
  }, [])

  useEffect(() => {
    if (status.pending > 0) {
      setStepContinue({ value: false, msg: 'Asegurate de subir las Imagenes' })
    } else if (images.length === 0) {
      setStepContinue({
        value: false,
        msg: 'No has seleccionado ninguna imagen',
      })
    } else {
      setStepContinue({ value: true })
    }
  }, [status])

  function handleImages({ target }) {
    const files = target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue

      let aux = file.name.split('.')
      let aux2 = aux.slice(0, aux.length - 1).join('.')

      const exist = existImage(aux2)
      if (exist) {
        toast.error('La imagen ' + aux2 + ' ya existe')
        continue
      }

      new Compressor(file, {
        quality: 0.6,
        success: (compressed) => {
          const reader = new FileReader()
          reader.onload = () => {
            addImages({
              id: images.length + i + 1,
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

  const uploadImagesToCloudinary = async () => {
    if (!images[0]) return
    //handleLoading();
    try {
      setLoading(true)
      const upImage = await uploadImagesCloudinary(images, clientId)
      console.log(upImage)
      addImagesUploaded(upImage)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="p-3">
      {Loading && <Loader />}
      <div className="flex  flex-col justify-center items-center text-white mt-4 mb-4">
        <div className="flex flex-col md:flex-row gap-y-2 justify-between w-full">
          <p className="flex flex-col text-lg font-medium">
            <span>Fotos selecionadas: {status.pending + status.uploaded} </span>
            <span>Fotos subidas: {status.uploaded}</span>
            <span>Fotos Pendientes: {status.pending}</span>
          </p>
          {status.pending + status.uploaded === 0 ? (
            <label
              htmlFor="upload-images"
              className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium self-center md:self-end "
            >
              Seleccionar Imagenes
            </label>
          ) : (
            <button
              className={`w-fit cursor-pointer text-xl ${
                status.pending === 0 ? 'bg-green-600' : 'bg-blue-700'
              } px-5 py-3 rounded hover:font-medium self-center md:self-end `}
              onClick={() => uploadImagesToCloudinary()}
              disabled={Loading}
            >
              <span
                className={`flex gap-2 items-center ${
                  Loading ? 'animate-pulse' : ''
                }`}
              >
                Subir Imagenes
                <CloudArrowUpIcon className="w-8 aspect-square " />
              </span>
            </button>
          )}
          {/* Agrwgar otro boton para navegar al "ordenar fotos" */}
          {/* <button
            className="border-2 rounded-lg w-fi h-fit px-2 py-4 text-2xl bg-blue-500 text-blue-"
          >
            Ordenar fotos
          </button> */}
        </div>
      </div>
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
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
          className="invisible w-full h-full absolute top-0 right-0"
          id="upload-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleImages(e)
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, i) => (
          <div key={i} className="relative w-fit">
            <img
              src={image.URL}
              alt="a image"
              key={i}
              className="w-[500px] aspect-square object-cover"
            />
            <div
              className={`absolute top-0 left-0 w-full p-1 flex justify-between items-center bg-gradient-to-b ${
                !image.upload ? 'from-black/70' : 'from-green-800/70'
              } to-transparent`}
            >
              <div className="flex gap-2 items-center">
                <div
                  className={`border-gray-300 h-6 aspect-square animate-spin rounded-full border-[5px] border-t-primary ${
                    Loading && !image.upload ? 'visible' : 'invisible'
                  }`}
                />
                <p className="flex flex-col">
                  <span className="text-sm font-medium">
                    {!image.upload ? 'Imagen no subida' : 'Imagen Subida'}
                  </span>
                  <span className="text-[12px] text-gray-200">
                    {getSizeImage(image.size)}
                  </span>
                </p>
              </div>
              <button
                onClick={async () => {
                  if (image.upload) {
                    setLoading(true)
                    await API.deleteSingleImg({
                      publicId: image.publicId,
                      id: image.id,
                    })

                    setLoading(false)
                  }
                  removeImages(i, image.upload ? 'uploaded' : 'pending')
                }}
                className=" w-7 aspect-square p-0.5 hover:text-red-800 text-gray-700 rounded-full bg-gray-400/40  hover:bg-gray-400 "
                title="Eliminar"
              >
                <XMarkIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
