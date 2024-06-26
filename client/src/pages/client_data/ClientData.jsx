import { PersonalData } from "./";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { API } from "../../api_instance";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../contexts/NavigationContext";

export function ClientData() {
  const { setStepContinue } = useNavigation();
  const navigate = useNavigate();
  const _client = useLoaderData();
  const [client, setClient] = useState(_client);
  const [errs, setErrs] = useState({});

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const updated = await API.updateClient({ clientId: _client.id, newClient: client })
      if(updated) {
        toast.success("Se cargaron sus datos correctamente");
            await API.session.disconnect({clientId: _client.id})
            navigate(`/client/${_client.id}/upload_images`);
      }
    } catch (err) {
      toast.error(`Error: ${err?.message}`);
    }
  }

  useEffect(() => {
    if (_client.email && _client.dni && _client.phone && _client.id) {
      setStepContinue({ value: true });
    } else {
      setStepContinue({ value: false, msg: "Por favor Completa tus datos" });
    }
  }, [_client]);

  return (
    <div className="h-full ">
      <h1 className="w-[75%] text-white mx-auto text-center mt-10">
        Complete los siguientes campos con la información requerida
      </h1>
      <form
        className="flex items-center flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <PersonalData
          errs={errs}
          setErrs={setErrs}
          client={client}
          _client={_client}
          setClient={setClient}
        />
        <button
          disabled={
            Object.values(errs)?.length ||
            !client.email ||
            !client.dni ||
            !client.phone
              ? true
              : false
          }
          className="mb-10 disabled:opacity-40 text-primary bg-white text-3xl p-2 rounded-lg hover:bg-gray-300  border-gray-300 hover:text-cyan-800"
          type="submit"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
