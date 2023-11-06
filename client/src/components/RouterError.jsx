import { useRouteError } from "react-router-dom";

export function RouterError() {
  console.log(useRouteError())
  return (
    <div>
      <h1>Esta accediendo a una ruta equivocada</h1>
      <h2>consulte con su administrador</h2>
    </div>
  )
}