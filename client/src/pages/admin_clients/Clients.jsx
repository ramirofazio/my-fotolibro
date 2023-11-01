import { CreateClient } from "./CreateClient"


export function Clients({clients}) {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 border-2">
      <div className="flex flex-col border-2 items-center">
        <h1>Clientes activos</h1>
        <h2>client 1</h2>
        <h2>client 2</h2>
        <h2>client 3</h2>
      </div>
      <CreateClient/>
    </div>
  )
}