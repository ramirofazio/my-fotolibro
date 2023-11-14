import { PersonalData } from "../client_data";
import { useState } from "react";
//import { isValidClient } from "../../utils";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { API } from "../../api_instance/index";
import { useNavigate, useLoaderData, Link, useParams } from "react-router-dom";

export function UpdateClient() {
  const navigate = useNavigate();
  const params = useParams();
  const _client = useLoaderData();
  const [client, setClient] = useState(_client);
  //const [errs, setErrs] = useState();
  console.log(_client);
  useEffect(() => {
    console.log(client);
  }, [client]);

  function submitClient(e) {
    e.preventDefault();
    //navigate("/admin/:adminId/clients")
    const { email, name, dni, phone } = client;
    const newData = {
      email,
      name,
      dni,
      phone,
    };
    API.updateClient({ newData, clientId: _client?.id }).then((res) => {
      console.log(res.data);
      //notify
      navigate(`/admin/${params?.adminId}/clients/create`);
    });
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
        <PersonalData admin={false} _client={client} setClient={setClient} />
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
