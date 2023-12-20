import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { NavLink, useLocation } from 'react-router-dom'
import { useNavigation } from '../contexts/NavigationContext'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function PreviousNext() {
  let pathname = useLocation().pathname.split('/')
  pathname = pathname[pathname.length - 1]
  const { current, getSteps, setCurrent, accessNext } = useNavigation()
  useEffect(() => {
    setCurrent(pathname)
  }, [pathname])
  return (
    <>
      <div
        className={`flex ${
          current === 0
            ? 'justify-end'
            : current === 2
            ? 'justify-start'
            : 'justify-between'
        } text-white py-2 px-4`}
      >
        {current !== 0 && (
          <NavLink
            className="flex gap-2 items-center group hover:font-medium"
            to={getSteps()[current - 1]?.to}
          >
            <ChevronLeftIcon className="aspect-square w-7 group-hover:bg-blue-700 rounded-full text-center p-1 group-hover:scale-125" />
            Atras
          </NavLink>
        )}
        {current !== 2 &&
          (accessNext.value ? (
            <NavLink
              className="flex gap-2 items-center group hover:font-medium"
              to={getSteps()[current + 1]?.to}
            >
              {getSteps()[current + 1]?.nextText}
              <ChevronRightIcon className="aspect-square w-7 group-hover:bg-blue-700 rounded-full text-center p-1 group-hover:scale-125" />
            </NavLink>
          ) : (
            <button
              className="flex gap-2 items-center group hover:font-medium hover:text-gray-400"
              onClick={() => toast.error(accessNext.msg)}
            >
              {getSteps()[current + 1]?.nextText}
              <ChevronRightIcon className="aspect-square w-6" />
            </button>
          ))}
      </div>
    </>
  )
}
