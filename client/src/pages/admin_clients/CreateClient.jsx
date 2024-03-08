import { PersonalData } from "../client_data";
import { useState } from "react";
import { API } from "../../api_instance/index";
import { toast } from "react-hot-toast";
import { useApp } from "../../contexts/AppContext";

export function CreateClient() {
  const { loading, adminClients } = useApp();

  const [client, setClient] = useState({});
  const [resetInput, setResetInput] = useState(false);
  const [errs, setErrs] = useState({});

  async function submitClient(e) {
    e.preventDefault();
    loading.set(true);

    const res = await API.createClient({
      ...client,
      name: client.name.toLowerCase().trim(),
    });
    
    if (res.status === 200) {
      toast.success("Cliente creado");
      loading.set(false);
      adminClients.add(res.data.newClient);
      setResetInput(true);
    } else {
      toast.success("error del servidor", { style: { borderColor: "red" } });
      loading.set(false);
    }
  }

  return (
    <div className="">
      <h1 className="text-2xl w-[75%] mx-auto my-4 text-white text-center">
        Complete los campos para crear un cliente con su codigo para cargar
        imagenes
      </h1>
      <form onSubmit={submitClient} className="">
        <PersonalData
          admin={true}
          setClient={setClient}
          errs={errs}
          setErrs={setErrs}
          resetInput={resetInput}
          setResetInput={setResetInput}
        />
        <div className="mx-auto w-fit">
          <button
            disabled={!client?.name || (Object.values(errs).length && true)}
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
