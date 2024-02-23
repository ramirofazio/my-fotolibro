import { createContext, useContext, useState } from 'react'
import { NavProvider } from './NavigationContext'
const AppContext = createContext({ images: [] })

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([])
  const [localImages, setLocalImages] = useState([])
  const [cloudImages, setCloudImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [status, setStatus] = useState({
    uploaded: 0,
    pending: 0,
  })

  const addLocalImages = (images) => {
    setLocalImages((cur) => [images, ...cur])
  }
  const removeLocalImage = (ID) => {
    setLocalImages((cur) => cur.filter(({ id }) => id !== ID))
  }
  const addImages = (images) => {
    setImages((cur) => {
      if (Array.isArray(images)) {
        setStatus((cur) => ({
          ...cur,
          pending: cur.pending + images.length,
        }))
        return [...cur, ...images]
      }
      setStatus((cur) => ({
        ...cur,
        pending: cur.pending + 1,
      }))
      return [...cur, images]
    })
  }

  const addImagesUploaded = (ImagesUploaded) => {
    const number = Object.keys(ImagesUploaded).length
    if (number === 0) return
    const uploaded = images.map((image) => {
      if (ImagesUploaded[image.originalName]) {
        return {
          ...image,
          URL: ImagesUploaded[image.originalName].URL,
          upload: true,
        }
      }

      return image
    })

    setStatus((cur) => ({
      ...cur,
      pending: Math.max(0, cur.pending - number),
      uploaded: Math.min(cur.uploaded + number, images.length),
    }))
    setImages(uploaded)
  }

  const removeImages = (index, type = 'pending') => {
    setStatus((cur) => ({
      ...cur,
      [type]: Math.max(0, cur[type] - 1),
    }))
    setImages((cur) => cur.filter((img, i) => i !== index))
  }

  const reorderImages = (images) => {
    setImages(images)
  }

  const imageExist = (name) => {
    const current = [...localImages, ...cloudImages]
    const nameSet = new Set()

    current.forEach(({ originalName }) => nameSet.add(originalName))
    return nameSet.has(name)
  }

  const removeImage = (id) => {
    setImages((cur) => cur.filter((img) => img.id !== id))
  }

  const updateInfoImages = (images) => {
    setImages(
      images.map((image) => ({
        ...image,
        upload: true,
      }))
    )
    setStatus((cur) => ({
      ...cur,
      uploaded: images.length,
    }))
  }

  return (
    <AppContext.Provider
      value={{
        localImages: {
          size: localImages.length,
          values: localImages,
          add: addLocalImages,
          remove: removeLocalImage,
          exist: imageExist,
          clear: () => setLocalImages([]),
        },
        cloudImages: {
          values: cloudImages,
          size: cloudImages.length,
          set: (images) => {
            setCloudImages(images)
          },
        },
        loading: {
          value: isLoading,
          set: (value) => setIsLoading(value),
        },
        images,
        addImages,
        removeImages,
        reorderImages,
        addImagesUploaded,
        status,
        updateInfoImages,
        removeImage,
      }}
    >
      <NavProvider>{children}</NavProvider>
    </AppContext.Provider>
  )
}
