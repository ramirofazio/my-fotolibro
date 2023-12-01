import { PersonalData } from "../client_data";
import { useState} from "react";
import { API } from "../../api_instance/index";
import { useNavigate, useLoaderData, Link, useParams } from "react-router-dom";
import {toast} from "react-hot-toast"

export function UpdateClient() {
  const navigate = useNavigate();
  const params = useParams();
  const _client = useLoaderData();
  const [client, setClient] = useState(_client);
  
  async function submitClient(e) {
    e.preventDefault();
    const { email, name, dni, phone } = client;
    const newData = {
      email,
      name,
      dni,
      phone,
    };
    const updated = await API.updateClient({ newData, clientId: _client?.id })
    console.log(updated)
    toast.success("Cliente actualizado")
    navigate(0)
    //navigate(`/admin/${params?.adminId}/clients/update/${_client.id}`);
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
      <form onSubmit={submitClient}>
        <PersonalData admin={false} _client={_client} setClient={setClient} />
        <div className="mx-auto w-fit">
          <button
            type="submit"
            className="rounded bg-white text-blue-500 hover:bg-opacity-70 hover:font-bold border-2 px-4 py-1 my-2 text-xl"
          >
            Editar cliente
          </button>
        </div>
      </form>
    </div>
  );
}
