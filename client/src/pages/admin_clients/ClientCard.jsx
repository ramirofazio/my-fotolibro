import { XCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal } from "../../components/Modal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function ClientCard({ name, email, phone, id, dni }) {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  return (
    <div className={`border-2 rounded p-2  bg-slate-700 border-base-[10%] ${params?.clientId === id && "border-4 border-red-500"} `}>
      <section>
        <picture className="flex w-fit ml-auto gap-3">
          <XCircleIcon
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 hover:text-red-400 text-red-600"
          />
          <Link to={`update/${id}`}>
            <PencilSquareIcon className="w-10 h-10 hover:text-blue-400 text-blue-600" />
          </Link>
        </picture>
        <h1 className="text-xl text-blue-500 capitalize w-fit">{name}</h1>
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
