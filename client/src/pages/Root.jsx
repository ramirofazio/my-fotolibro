import { Outlet, useLoaderData } from "react-router-dom";
import { Nav } from "../components/";
import { UrlInUse } from "../components/UrlInUse";
import { useEffect, useState } from "react";
import { API } from "../api_instance";
import { PreviousNext } from "../components/PreviousNext";
import { SuccessPage } from "./SuccessPage";
import { Loader } from "../components/Loader";
import { useApp } from "../contexts/AppContext";
import { toast } from 'react-hot-toast'
import {ChevronRightIcon } from '@heroicons/react/24/outline'
import { Scroll } from "../components/Scroll";

export function Root() {
  const { id, active_link, upload_preset } = useLoaderData();
  const { client } = useApp();
  const [render, setRender] = useState(false)


  useEffect(() => {
   client.set({
      upload_preset,
    });

    console.log(client.upload_preset);
    
    
  }, [client.upload_preset]);



  useEffect(()=> {
    window.addEventListener("unload" ,() => API.session.disconnect({clientId: id}))
    window.addEventListener("beforeunload" ,() => API.session.disconnect({clientId: id}))

    API.session.connect({
      clientId: id
    }).then(({ data })=> {
      toast.success(data.online)
    }).catch(({response, ...err})=>{
      if(response){
        toast.error(response.data.msg)
        if(response.status === 409) return setRender(true)
      }else{
        toast.error(err.message)
      }
    })

    return () => window.addEventListener("unload" ,() => API.session.disconnect({clientId: id}))
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
              API.session
                .forceConnect({
                  clientId: id,
                })
                .then(({ data }) => {
                  if (data?.online) {
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
    <div className="bg-main min-h-screen min-w-[320px]">
      <>
        <Nav />
        <PreviousNext />
        <Outlet />
        <Scroll />
        <Loader />
      </>
    </div>
  );
}
