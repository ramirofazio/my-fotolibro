import { XCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Modal } from "../../components/Modal";
import { useState } from "react";

export function ClientCard({ name, email, phone, id, dni }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 rounded p-2   border-base-[10%] ">
      <section>
        <picture className="flex w-fit ml-auto gap-3">
          <XCircleIcon onClick={() => setIsOpen(true)} className="w-10 h-10 hover:text-red-400 text-red-600" />
          <PencilSquareIcon className="w-10 h-10 hover:text-blue-400 text-blue-600" />
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
        <h1>Se borrara todo los books relacionados al usuario: {name}</h1>
      </Modal>
    </div>
  );
}
