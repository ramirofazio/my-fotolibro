import { PersonalData, ClientAdress } from "./";
import { useEffect, useState } from "react";

export function ClientData() {
  const [client, setClient] = useState({
    dni: null,
    name: null,
    phone: null,
    email: null,
  });
  const [adress, setAdress] = useState({
    postal_code: null,
    province: null,
    adress: null,
    email: null,
    floor: null,
    deparment: null,
  });

  useEffect(() => {
    console.log(client)
    console.log(adress)
  }, [client, adress])

  function handleSubmit(e) {
    
  }

  return (
    <div className="h-full ">
      <h1 className="w-[75%] text-white mx-auto text-center mt-10">Complete los siguientes campos con la información requerida</h1>
      <form className="flex items-center flex-col" onSubmit={handleSubmit}>
        <PersonalData setClient={setClient} />
        <hr />
        <ClientAdress setAdress={setAdress}/>
        <section>
          <p>Observaciones: </p>
          <textarea />
        </section>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
