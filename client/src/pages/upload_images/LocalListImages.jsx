import { useApp } from '../../contexts/AppContext'
import { ViewImage } from './ViewImage'

export function LocalListImages() {
  const { localImages, cloudImages } = useApp()

  if (!localImages.size && !cloudImages.size)
    return (
      <p className="text-center p-10 text-lg col-span-2 md:col-span-4">
        No has selecionado imagenes
      </p>
    )

  if (!localImages.size) return null
  return (
    <>
      <h2 className="text-white text-center  md:col-span-4 col-span-2 text-xl p-3 sticky top-0 z-50 bg-main/70 backdrop-blur-sm">
        Imagenes Pendientes
      </h2>
      {localImages.values.map(({ id, ...image }) => (
        <ViewImage
          key={id}
          {...image}
          onRemove={() => {
            const res = confirm(
              `¿Quieres eliminar la imagen ${image.originalName}?`
            )
            
            if (res) localImages.remove(id)
          }}
        />
      ))}
    </>
  )
}
