import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { useRouteError } from "react-router-dom";
import { SuccessPage } from "./SuccessPage";

export function RouterError() {
  let { type, client } = JSON.parse(useRouteError().data);

  if (type === "END_BOOK") {
    return <SuccessPage client={client} />;
  }

  // if (type === "CONNECTED") {
  //   return <UrlInUse id={client.id}/>;
  // }

  return (
    <main className="bg-slate-800 h-screen flex justify-center items-center">
      <div className="border-slate-700 border-2 p-4 h-fit  w-fit text-2xl lg:text-4xl mx-auto bg-slate-600 rounded-sm px-4">
        <NoSymbolIcon className="h-12 mx-auto text-red-600" />
        <h1>El link no se reconoce como el de un cliente activo. </h1>
        <h2 className="text-white my-1">Consulte con su administrador</h2>
      </div>
    </main>
  );
}
