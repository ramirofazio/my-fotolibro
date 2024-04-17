import { ClockIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../api_instance";


export function UrlInUse({ id }) {
  const navigate = useNavigate();
  const {clientId} = useParams()
  
  return (
    <main className="relative flex flex-col items-center justify-center h-screen bg-slate-800 ">
      <div className="flex mx-auto justify-center  items-center w-fit border-slate-800 border-4 bg-slate-700 p-4 gap-2">
        <ClockIcon className="h-12 text-red-600" />
        <h1 className="text-xl md:text-2xl w-[80%] md:w-[60%] ">
          El link quedo abierto en otra pestaña o
          alguien mas lo esta usando en este momento.
        </h1>
      </div>
        <p className="text-xl max-w-[90%]">Presione forzar para cerrar las demas sesiones</p>
      <button
        onClick={async () => {
          await API.session.forceConnect({ clientId: id });
          navigate(`/client/${clientId}/client_data`);
        }}
        className="fixed top-5 right-5 flex items-center gap-2 text-3xl lg:text-4xl text-gray-400 hover:text-gray-100"
      >
        Forzar
        <ChevronRightIcon className="w-10 h-10" />
      </button>
    </main>
  );
}
