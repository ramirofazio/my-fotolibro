import { PersonalData, ClientAdress } from "./";
import { useState } from "react";

export function ClientData() {
  const [personal, setPersoanl] = useState({
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

  function onSubmit(e) {
    
  }

  return (
    <div className="h-full border-2 border-yellow-300">
      <h1>SOY EL CLIENT DATA</h1>
      <form>
        <PersonalData />
        <ClientAdress />
        <section>
          <p>Observaciones: </p>
          <textarea />
        </section>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
