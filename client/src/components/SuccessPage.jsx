import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function SuccessPage() {
  return (
    <div className="bg-main min-h-screen text-white flex flex-col justify-center items-center">
      <CheckCircleIcon className="aspect-square w-20 text-green-700 lg:w-24" />
      <h1 className="text-3xl font-medium"> Ecxelente!</h1>
      <div className="w-1/2 space-y-2 mt-4 text-center lg:text-2xl">
        <p>
          Sus fotos fueron enviadas exitosamente. Si su libro es URGENTE envie
          un WhatsApp informandolo.
        </p>
        <p>
          De lo contrario pronto nos comunicaremos para el diseño del Fotolibro
        </p>
        <strong className="my-2 text-xl lg:text-3xl">
          Para finalizar cierre la pagina!
        </strong>
      </div>
    </div>
  );
}
