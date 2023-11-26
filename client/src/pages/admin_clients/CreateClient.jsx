import { PersonalData } from "../client_data";
import { useState } from "react";
import { API } from "../../api_instance/index";
import { useNavigate, useParams } from "react-router-dom";
import {toast} from "react-hot-toast"

export function CreateClient() {
  const navigate = useNavigate();
  const [client, setClient] = useState({});

  const params = useParams();

  async function submitClient(e) {
    e.preventDefault();
    const res = await API.createClient(client);
    console.log(res);
    if(res?.data) {
      toast.success("Cliente creado")
    } else {
      toast.success("error del servidor", {style: {borderColor: "red"}})
    }

    navigate(`/admin/${params?.adminId}/clients/create`)
  }

  return (
    <div>
      <h1 className="text-2xl w-[75%] mx-auto my-4 text-violet-400 text-center">
        Complete los campos para crear un cliente con su codigo para cargar
        imagenes
      </h1>
      <form onSubmit={submitClient} className="">
        <PersonalData admin={false} setClient={setClient} />
        <div className="mx-auto w-fit">
          <button
            disabled={!client?.name && true}
            type="submit"
            className="disabled:opacity-40 rounded bg-white text-blue-500 hover:bg-opacity-70 hover:font-bold border-2 px-4 py-1 my-2 text-xl"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
