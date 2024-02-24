import './index.css'
import ReactDOM from 'react-dom/client'
import { Routes } from './router/RouterProvider'
import { AppProvider } from './contexts/AppContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
    <Routes />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
      }}
    />
  </AppProvider>
)
