import { PersonalData } from "../client_data";
import { useState } from "react";
import { API } from "../../api_instance/index";
import { useLoaderData, Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useApp } from "../../contexts/AppContext";

export function UpdateClient() {
  const { loading, adminClients } = useApp();
  const params = useParams();
  const _client = useLoaderData();

  const [client, setClient] = useState(_client);
  const [errs, setErrs] = useState({});

  async function updateClient(e) {
    try {
      e.preventDefault();
      loading.set(true)
      const { email, name, dni, phone, active_link, created_at, id } = client;
      
      const newClient = {
        email,
        name,
        dni,
        phone,
      };
      const res = await API.updateClient({ newClient, clientId: _client?.id });
      
      if (res.status === 200) {
        loading.set(false);
        toast.success("Cliente actualizado");
        _client.name = name
        adminClients.update({...newClient, active_link, created_at, id}, _client?.id)
      } else {
        loading.set(false);
        toast.error(
          `No actualizado ${res.data.message ? res.data.message : res.status}`
        );
      }
    } catch (err) {
      loading.set(false);
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-4">
        <h1 className="text-3xl text-white ">
          Esta editando el usuario {_client?.name}
        </h1>
        <Link to={`/admin/${params.adminId}/clients/create`}>
          <button className=" rounded bg-white text-blue-500 hover:bg-opacity-70 hover:font-bold border-2 px-4 py-1 my-2 text-xl">
            Crear nuevo cliente
          </button>
        </Link>
      </div>
      <form onSubmit={updateClient}>
        <PersonalData
          admin={true}
          errs={errs}
          setErrs={setErrs}
          client={client}
          _client={_client}
          setClient={setClient}
        />
        <div className="mx-auto w-fit">
          <button
            type="submit"
            className="disabled:opacity-40 rounded bg-white text-blue-500 hover:bg-opacity-70 hover:font-bold border-2 px-4 py-1 my-2 text-xl"
            disabled={
              !client?.name ||
              (Object.values(errs).length && true) ||
              client == _client
            } /* que haya realizado cambios */
          >
            Editar cliente
          </button>
        </div>
      </form>
    </div>
  );
}
