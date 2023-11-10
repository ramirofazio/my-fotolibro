import { PersonalData } from "./";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {API} from "../../api_instance"


export function ClientData() {
  const navigate = useNavigate()
  const _client = useLoaderData()
  const [client, setClient] = useState();
  console.log(_client)
  async function handleSubmit(e) {
    e.preventDefault()
    // setLoader(true)
    API.updateClient({ clientId: _client.id, newData: client })
    .then(res => {
      if(res.data) {
        // setLoader(false)
        // popup "se guardo tu info correctamente"
        console.log(res.data)
        navigate(`/client/${_client.id}/upload_images`)
      }
      else {
        console.log(res)
        // popup "ocurrio este error"
        // setLoader(false)
      }
    })
    
  }

  return (
    <div className="h-full ">
      <h1 className="w-[75%] text-white mx-auto text-center mt-10">
        Complete los siguientes campos con la información requerida
      </h1>
      <form className="flex items-center flex-col gap-3" onSubmit={handleSubmit}>
        <PersonalData _client={_client} setClient={setClient} />
        <hr />
        <section className="w-[70%]  flex flex-col justify-center items-center">
          <p className="w-fit">Observaciones: </p>
          <textarea className="resize-none my-3" />
        </section>
        <button className="p-1 text-primary bg-white  border-gray-400" type="submit">Guardar</button>
      </form>
    </div>
  );
}
