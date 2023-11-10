import { useRouteError } from "react-router-dom";

export function RouterError() {
  console.log(useRouteError());
  return (
    <div>
      <h1>El link no se reconoce como el de un cliente actvio</h1>
      <h2>consulte con su administrador</h2>
    </div>
  );
}
