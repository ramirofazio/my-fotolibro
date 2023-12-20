import { createContext, useContext, useState } from 'react'

const NavigationContext = createContext({ steps: {} })

export const useNavigation = () => useContext(NavigationContext)

export const NavProvider = ({ children }) => {
  const [Steps, setSteps] = useState({
    current: 0,
    access: {
      value: null,
      msg: '',
    },
    routes: {
      client_data: {
        to: 'client_data',
        access: true,
        text: 'Completa tus datos',
        index: 0,
      },
      upload_images: {
        to: 'upload_images',
        access: false,
        text: 'Subi tus fotos',
        nextText: 'Subir Imagenes',
        index: 1,
      },
      sort_images: {
        to: 'sort_images',
        access: false,
        text: 'Ordena tus fotos',
        nextText: 'Pasar a ordenar',
        index: 2,
      },
    },
  })

  const setCurrent = (pathname) =>
    setSteps((cur) => ({ ...cur, current: cur.routes[pathname].index }))

  const getSteps = () => {
    const routes = []
    for (const key in Steps.routes) {
      routes.push(Steps.routes[key])
    }
    return routes
  }

  const setStepContinue = ({ value, msg = '' }) =>
    setSteps((cur) => ({
      ...cur,
      access: {
        value,
        msg,
      },
    }))

  return (
    <NavigationContext.Provider
      value={{
        current: Steps.current,
        getSteps,
        setCurrent,
        setStepContinue,
        accessNext: Steps.access,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
