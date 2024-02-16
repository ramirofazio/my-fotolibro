
//import { ClientCard } from "./ClientCard";
import { useLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ClientCard2 } from "./ClientCard2";

export function Clients() {
  const clients = useLoaderData()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-auto">
      <div className="mb-auto p-4 grid grid-cols-1 lg:grid-cols-2 place-items-center gap-2 lg:gap-5 border-r-2">
        <h1 className="text-3xl text-violet-400 font-sans my-4 lg:col-span-2">Clientes activos</h1>
        {clients?.length ? (
          clients.map((c, i) => {
            return <ClientCard2 created_at={c.created_at} active_link={c.active_link} dni={c.dni} email={c.email} phone={c.phone} id={c.id} key={i} name={c.name} />;
          })
        ) : (
          <div className="place-self-start">
            <h1 className="text-3xl text-white">No se encontraron clientes activos</h1>
          </div>
        )}
      </div>
      <Outlet/>
    </div>
  );
}
