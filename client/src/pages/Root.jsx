import { Outlet, useLoaderData } from 'react-router-dom'
import { Nav } from '../components/'
import { UrlInUse } from '../components/UrlInUse'
import { useEffect } from 'react'
import { API } from '../api_instance'
import { PreviousNext } from '../components/PreviousNext'
import { SuccessPage } from './SuccessPage'
import { Loader } from '../components/Loader'

export function Root() {
  const { id, active_link, online } = useLoaderData()

  useEffect(() => {
    window.addEventListener('beforeunload', () => API.disconnectClient(id))
    return () => {
      window.removeEventListener('beforeunload', () => API.disconnectClient(id))
    }
  }, [])

  if (!active_link) {
    return <SuccessPage />
  }

  if (false) return <UrlInUse />

  return (
    <div className="bg-main min-h-screen">
      <>
        <Nav />
        <PreviousNext />
        <Outlet />
        <Loader />
      </>
    </div>
  )
}
