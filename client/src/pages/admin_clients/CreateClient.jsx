import { PersonalData } from "../client_data";
import { useState } from "react";
import { API } from "../../api_instance/index";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useApp } from "../../contexts/AppContext";

export function CreateClient() {
  const { loading, refresh, adminClients } = useApp()
  const navigate = useNavigate();
  const [client, setClient] = useState({});

  
  async function submitClient(e) {
    e.preventDefault();
    loading.set(true)
  
    const res = await API.createClient({
      ...client,
      name: client.name.toLowerCase().trim(),
    });
    console.log(res)
    if (res.status === 200) {
      toast.success("Cliente creado");
      loading.set(false)
      adminClients.add(res.data.newClient)
    } else {
      toast.success("error del servidor", { style: { borderColor: "red" } });
      loading.set(false)
    }
    //navigate(0);
    //navigate(`/admin/${params?.adminId}/clients/create`)
  }

  return (
    <div className="">
      <h1 className="text-2xl w-[75%] mx-auto my-4 text-violet-400 text-center">
        Complete los campos para crear un cliente con su codigo para cargar
        imagenes
      </h1>
      <form onSubmit={submitClient} className="">
        <PersonalData admin={true} setClient={setClient} />
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
