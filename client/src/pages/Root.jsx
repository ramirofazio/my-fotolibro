import { Outlet, useLoaderData } from "react-router-dom";
import { Nav } from "../components/";
import { UrlInUse } from "../components/UrlInUse";
import { useEffect } from "react";
import { API } from "../api_instance";
import { PreviousNext } from "../components/PreviousNext";
import { SuccessPage } from "./SuccessPage";
import { Loader } from "../components/Loader";
import { useApp } from "../contexts/AppContext";
import { storage } from "../utils"
import { toast } from 'react-hot-toast'
import {ChevronRightIcon } from '@heroicons/react/24/outline'

export function Root() {
  const { id, active_link, upload_preset } = useLoaderData();
  const { client } = useApp();
  const [render, setRender] = useState(false)


  useEffect(() => {
    window.addEventListener("beforeunload", () => API.disconnectClient(id));
    client.set({
      upload_preset,
    });

    console.log(client.upload_preset);
    
    return () => {
      window.removeEventListener("beforeunload", () =>
        API.disconnectClient(id)
      );
    };
  }, [client.upload_preset]);



  useEffect(()=> {
    const device = storage.get({name: 'device'})

    API.session.connect({
      clientId: id, deviceId: device?.id
    }).then(({ data })=> {
      storage.set({
        name: 'device',
        object: {
          id: data.session.id
        }
      })
    }).catch(({response, ...err})=>{
      if(response){
        toast.error(response.data.msg)
        if(response.status === 409) return
      }else{
        toast.error(err.message)
      }
    })
  },[])

  if (!active_link) {
    return <SuccessPage />;
  }

  if (render)
    return (
      <>
        <button
          onClick={() => {
            const res = confirm(
              '¿Deseas Continuar? \n ! Si hay usuarios conectados estos seran desconectados.'
            )

            if (res) {
              const device = storage.get({ name: 'device' })
              API.session
                .forceConnect({
                  clientId: id,
                  deviceId: device?.id || null,
                })
                .then(({ data }) => {
                  if (data?.session) {
                    setRender(false)
                    storage.set({
                      name: 'device',
                      object: { id: data?.session?.id },
                    })
                    toast.success('Acabas de desabilitar un dispositivo.')
                  }
                })
            }
          }}
          className="items-center fixed top-6 right-6 text-white font-semibold flex gap-2 hover:bg-slate-700 px-2 py-1 rounded hover:shadow"
        >
          {' '}
          Continuar <ChevronRightIcon className="w-5 aspect-square" />{' '}
        </button>
        <UrlInUse />
      </>
    )

  return (
    <div className="bg-main min-h-screen">
      <>
        <Nav />
        <PreviousNext />
        <Outlet />
        <Loader />
      </>
    </div>
  );
}
