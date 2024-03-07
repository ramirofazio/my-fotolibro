import { useLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ClientCard } from "./ClientCard";
import { useApp } from "../../contexts/AppContext";
import { useEffect } from "react";

export function Clients() {
  const { adminClients } = useApp();
  const clients = useLoaderData();

  useEffect(() => {
    adminClients.set(clients);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-auto">
      <div className="mb-auto p-4 grid grid-cols-1 lg:grid-cols-2 place-items-center gap-2 lg:gap-5 border-r-2">
        <h1 className="text-3xl text-violet-400 font-sans my-4 lg:col-span-2">
          Clientes activos
        </h1>
        {adminClients.value?.length ? (
          adminClients.value.map((c, i) => (
            <ClientCard clientData={c} key={i} />
          ))
        ) : (
          <div className="place-self-start">
            <h1 className="text-3xl text-white">
              No se encontraron clientes activos
            </h1>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
