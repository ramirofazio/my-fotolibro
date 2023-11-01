import { PersonalData } from "./";
import { useState } from "react";

export function ClientData() {
  const [client, setClient] = useState({
    dni: null,
    name: null,
    phone: null,
    email: null,
  });

  function handleSubmit() {
    console.log(client);
  }

  return (
    <div className="h-full ">
      <h1 className="w-[75%] text-white mx-auto text-center mt-10">
        Complete los siguientes campos con la información requerida
      </h1>
      <form className="flex items-center flex-col gap-3" onSubmit={handleSubmit}>
        <PersonalData setClient={setClient} />
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
