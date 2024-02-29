import { createContext, useContext, useState } from 'react'
import { NavProvider } from './NavigationContext'
const AppContext = createContext({ images: [] })

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [localImages, setLocalImages] = useState([])
  const [cloudImages, setCloudImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(true)

  const addLocalImages = (images) => {
    setLocalImages((cur) => [...images, ...cur])
  }
  const removeLocalImage = (ID) => {
    setLocalImages((cur) => cur.filter(({ id }) => id !== ID))
  }
  const imageExist = (name) => {
    const current = [...localImages, ...cloudImages]
    const nameSet = new Set()

    current.forEach(({ originalName }) => nameSet.add(originalName))
    return nameSet.has(name)
  }

  const verifyUpload = (cloudImages) => {
    const currentCloud = [...cloudImages]
    const newLocal = []
    const namesSet = new Set()
    currentCloud.forEach(({ originalName }) => namesSet.add(originalName))
    localImages.forEach((img) => {
      if (!namesSet.has(img.originalName)) {
        newLocal.push(img)
      }
    })
    setLocalImages([...newLocal])
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
          verify: verifyUpload,
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
        refresh: {
          value: refresh,
          off: function () {
            setRefresh(false)
          },
          on: function () {
            setRefresh(true)
          },
        },
      }}
    >
      <NavProvider>{children}</NavProvider>
    </AppContext.Provider>
  )
}
