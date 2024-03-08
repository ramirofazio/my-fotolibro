import { useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { FolderCard } from "./FolderCard";
import { useLoaderData } from "react-router-dom";
import { API } from "../../api_instance";
import { toast } from "react-hot-toast";

export function Folders() {
  const { adminClients, loading } = useApp();
  const folders = useLoaderData();

  useEffect(() => {
    adminClients.set(folders);
  }, []);

  async function onRemove(name, clientId) {
    const res = confirm(`¿Quieres eliminar al cliente ${name}?`);
    if (res) {
      try {
        loading.set(true);
        await API.deleteClient(clientId);
        await API.deleteFolder(clientId);

        loading.set(false);
        toast.success(`Se elimino ${name}`);
        adminClients.remove(clientId);
      } catch (err) {
        loading.set(false);
        toast.error(`Err: ${err.message}`);
      }
    }
    loading.set(false);
  }

  return (
    <div className="border-2 my-auto h-screen px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {adminClients.value?.length ? (
          adminClients.value.map((f, i) => {
            return <FolderCard onRemove={onRemove} clientData={f} key={i} />;
          })
        ) : (
          <div className="w-fit">
            <h1 className="text-3xl text-white">
              No se encontraron carpetas con fotos
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
