import { useLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ClientCard } from "./ClientCard";
import { useApp } from "../../contexts/AppContext";
import { useEffect } from "react";
import { API } from "../../api_instance";
import { toast } from "react-hot-toast";

export function Clients() {
  const { adminClients, loading } = useApp();
  const clients = useLoaderData();

  useEffect(() => {
    adminClients.set(clients);
  }, []);

  // async function handleDelete() {
  //   await API.deleteClient(id);
  //   await API.deleteFolder(id);
  //   toast.success(`Se elimino "${name}"`);
  //   navigate(0);
  //   navigate(`/admin/${params?.adminId}/clients/create`);
  // }

  async function onRemove(name, clientId) {
    const res = confirm(`¿Quieres eliminar al cliente ${name}?`);
    if (res) {
      try {
        loading.set(true);
        const cres = await API.deleteClient(clientId);
        const fres = await API.deleteFolder(clientId);
        console.log(cres.data, fres.data)
        loading.set(false);
        toast.success(`Se elimino ${name}`);
        adminClients.remove(clientId);
      } catch(err) {
        loading.set(false);
        toast.error(`Err: ${err.message}`)
      }
    }
    loading.set(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-auto">
      <div className="mb-auto p-4 grid grid-cols-1 lg:grid-cols-2 place-items-center gap-2 lg:gap-5 border-r-2">
        <h1 className="text-3xl text-violet-400 font-sans my-4 lg:col-span-2">
          Clientes activos
        </h1>
        {adminClients.value?.length ? (
          adminClients.value.map((c, i) => (
            <ClientCard onRemove={onRemove} clientData={c} key={i} />
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
