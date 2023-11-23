import {
  XCircleIcon,
  PencilSquareIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "../../components/Modal";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../../api_instance";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export function ClientCard({ name, email, phone, id, dni }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  function handleDelete() {
    API.deleteClient(id).then(() =>
      navigate(`/admin/${params?.adminId}/folders/`)
    );
  }

  return (
    <div
      className={`border-2 rounded p-2  bg-slate-700 border-base-[10%] ${
        params?.clientId === id && "border-4 border-red-500"
      } `}
    >
      <section>
        <picture className="flex w-fit ml-auto gap-3">
          <CopyToClipboard
            text={`http://localhost:5173/client/${id}/client_data`} // TODO cambiar a url de producción
          >
            <LinkIcon className="w-9 h-9 text-gray-400 hover:text-white" />
          </CopyToClipboard>
          <Link to={`update/${id}`}>
            <PencilSquareIcon className="w-10 h-10 hover:text-blue-400 text-blue-600" />
          </Link>
          <XCircleIcon
            onClick={handleDelete}
            className="w-10 h-10 hover:text-red-400 text-red-600"
          />
        </picture>
        <h1 className=" text-white text-2xl capitalize w-fit">{name}</h1>
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>Se borrara todo la informacion de '{name}' en la base de datos</h1>
      </Modal>
    </div>
  );
}
