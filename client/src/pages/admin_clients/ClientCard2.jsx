import {
  XCircleIcon,
  PencilSquareIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../../api_instance";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

export function ClientCard2({
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
      className={`border-2 rounded p-2 w-full  bg-slate-700 border-base-[10%] ${
        params?.clientId === id && "border-4 border-red-500"
      } `}
    >
      <h1 className="truncate font-bold text-lg lg:text-xl font-serif uppercase text-white ">
        {name}
      </h1>
      <section className="flex flex-col">
        <button className="self-end w-28 my-4 rounded-lg border-2">
          Cambiar
        </button>
        <article className="truncate mr-auto my-2 flex flex-col border-[2.5px] py-2 border-blue-700 px-1 w-full overflow-hidden rounded-lg justify-between">
          <span className="flex items-center  gap-1.5 ">
            <label
              className="text-xl font-bold text-violet-500 "
              htmlFor="email"
            >
              Email-
            </label>
            <p id="email" className="text-[16px] border-b-2 truncate">
              {email}
            </p>
          </span>
          <span className="flex items-center gap-1.5">
            <label
              className="text-xl font-bold text-violet-500 "
              htmlFor="phone"
            >
              Numero-
            </label>
            <p id="phone" className="text-[16px]  border-b-2">
              {phone}
            </p>
          </span>
          <span className="flex items-center gap-1.5">
            <label className="text-xl font-bold text-violet-500 " htmlFor="dni">
              DNI-
            </label>
            <p id="dni" className="text-[16px] border-b-2">
              {dni}
            </p>
          </span>
        </article>

        <span className="border-2 flex-col flex relative">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://myfotolibro.cloud/client/${id}/client_data`}
            className="text-lg  truncate px-1 text-blue-500 border-2 border-dashed border-red-400"
          >
            {`https://myfotolibro.cloud/client/${id}/client_data`}
          </a>

          <picture className="w-fit border-2 absolute -bottom-10 -right-0.5 border-black  rounded-full p-1 bg-gray-200 hover:bg-gray-600 transition-all ">
            <CopyToClipboard
              text={
                import.meta.env.VITE_ENV === "production"
                  ? `http://myfotolibro.cloud/client/${id}/client_data`
                  : `http://localhost:5173/client/${id}/client_data`
              }
            >
              <PaperClipIcon
                onClick={() => toast("URL copiado", { icon: "📎" })}
                className="w-8 h-8 text-gray-600 hover:text-gray-400"
              />
            </CopyToClipboard>
          </picture>
        </span>
        <span className="flex flex-row items-center mt-14">
          <button
            onClick={handleDelete}
            className="hover:text-red-400 border-[3px] w-[60%] border-red-500 p-1 rounded-lg my-2 bg-red-400  text-red-600"
          >
            <p className="text-lg">ELIMINAR</p>
          </button>
          <Link className="ml-auto" to={`update/${id}`}>
            <PencilSquareIcon className="w-12 h-12 hover:text-blue-400 text-blue-600" />
          </Link>
        </span>
      </section>
    </div>
  );
}