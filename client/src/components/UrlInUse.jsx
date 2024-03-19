import { ClockIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { API } from "../api_instance";

export function UrlInUse({ id }) {
  const navigate = useNavigate();
  return (
    <main className="relative flex items-center justify-center h-screen bg-slate-800 ">
      <div className="flex  items-center w-fit border-slate-800 border-4 bg-slate-700 p-4 gap-2">
        <ClockIcon className="h-12 text-red-600" />
        <h1 className="text-2xl">
          El link actual se esta usando en este momento
        </h1>
      </div>
      <button
        onClick={async () => {
          await API.session.forceConnect({ clientId: id });
          navigate(0);
        }}
        className="fixed top-5 right-5 flex items-center gap-2 text-gray-400 hover:text-gray-100"
      >
        Forzar
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </main>
  );
}
