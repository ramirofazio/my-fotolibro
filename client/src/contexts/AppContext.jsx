import { createContext, useContext, useState } from 'react'
import { NavProvider } from './NavigationContext'
const AppContext = createContext({ images: [] })

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([])

  const [status, setStatus] = useState({
    uploaded: 0,
    pending: 0,
  })

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

  const existImage = (nameImage) => {
    if (images.length === 0) return null

    const objWithKeys = images.reduce((acc, obj) => {
      acc[obj.originalName] = obj
      return acc
    }, {})

    return !!objWithKeys[nameImage]
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

  const arrayToObject = () => {
    const objWithKeys = images.reduce((acc, obj) => {
      acc[obj.originalName] = obj
      return acc
    }, {})

    return objWithKeys
  }

  return (
    <AppContext.Provider
      value={{
        images,
        addImages,
        removeImages,
        reorderImages,
        addImagesUploaded,
        status,
        existImage,
        updateInfoImages,
      }}
    >
      <NavProvider>{children}</NavProvider>
    </AppContext.Provider>
  )
}
