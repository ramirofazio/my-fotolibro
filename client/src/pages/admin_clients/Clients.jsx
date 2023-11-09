import { CreateClient } from "./CreateClient";
import { ClientCard } from "./ClientCard";
import { useLoaderData } from "react-router-dom";

export function Clients() {
  const clients = useLoaderData()
  console.log(clients)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-2">
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 place-items-center gap-2 lg:gap-5">
        <h1 className="text-xl text-primary my-4 lg:col-span-2">Clientes activos</h1>
        {clients?.length ? (
          clients.map((c, i) => {
            return <ClientCard dni={c.dni} email={c.email} phone={c.phone} id={c.id} key={i} name={c.name} />;
          })
        ) : (
          <div>
            <h1>No se encontraron clientes activos</h1>
          </div>
        )}
      </div>
      <CreateClient />
    </div>
  );
}