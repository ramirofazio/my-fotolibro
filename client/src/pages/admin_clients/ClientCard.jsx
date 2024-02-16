import {
  XCircleIcon,
  PencilSquareIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../../api_instance";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

export function ClientCard({
  name,
  email,
  phone,
  id,
  dni,
  created_at,
  active_link = false,
}) {
  const navigate = useNavigate();
  const params = useParams();

  async function handleDelete() {
    await API.deleteClient(id);
    await API.deleteFolder(id);
    toast.success(`Se elimino "${name}"`);
    navigate(0);
    navigate(`/admin/${params?.adminId}/clients/create`);
  }

  async function updateActiveClient() {
    await API.updateActiveClient(id);
    toast.success(`Se actualizo el estado`);
    navigate(0);
  }


  return (
    <div
      className={`border-2 rounded p-2 w-[80%]  bg-slate-700 border-base-[10%] ${
        params?.clientId === id && "border-4 border-red-500"
      } `}
    >
      <section>
        <span className="mr-auto my-2 flex justify-between">
          <span>
            <p className="border-b-[1px]">Creado</p>
            <p className=" font-bold">{created_at}</p>
          </span>
          <span className="flex flex-col">
            <p className="border-b-[1px]">Estado</p>
            <span className="flex  items-center gap-2">
              <p
                className={`w-3.5 h-3.5 rounded-full border-2 ${
                  active_link
                    ? "border-green-600 bg-green-500"
                    : "border-yellow-500 bg-yellow-300"
                }`}
              ></p>
              <p className=" font-bold">
                {active_link ? "Activo" : "Desactivado"}
              </p>
            </span>
          </span>
          <button onClick={updateActiveClient} className="w-[25%] border-2 rounded-md border-blue-600 bg-slate-400 hover:bg-white text-sm font-semibold uppercase text-violet-900">cambiar estado</button>
        </span>
        <picture className="flex items-center justify-end ml-auto gap-3 mb-2">
          <h1 className=" text-white mr-auto text-2xl capitalize w-fit">
            {name}
          </h1>
          <CopyToClipboard
            text={
              import.meta.env.VITE_ENV === "production"
                ? `http://myfotolibro.cloud/client/${id}/client_data`
                : `http://localhost:5173/client/${id}/client_data`
            }
          >
            <PaperClipIcon
              onClick={() => toast("URL copiado", { icon: "📎" })}
              className="w-9 h-9 text-gray-400 hover:text-white"
            />
          </CopyToClipboard>
          <Link to={`update/${id}`}>
            <PencilSquareIcon className="w-10 h-10 hover:text-blue-400 text-blue-600" />
          </Link>
          <XCircleIcon
            onClick={handleDelete}
            className="w-10 h-10 hover:text-red-400 text-red-600"
          />
        </picture>

        <h1 className="text-xl text-blue-500 border-y-2 border-dashed border-red-400">
          {id}
        </h1>
      </section>
      <section>
        <h2 className="w-fit mx-auto italic my-2">Info personal</h2>
        <p>Email: {email}</p>
        <p>Numero: {phone}</p>
        <p>DNI: {dni}</p>
      </section>
    </div>
  );
}
