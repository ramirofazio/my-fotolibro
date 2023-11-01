import { CreateClient } from "./CreateClient";
import { ClientCard } from "./ClientCard";

export function Clients({ clients }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-2">
      <div className="flex flex-col border-2 items-center">
        <h1>Clientes activos</h1>
        {clients?.length ? (
          clients.map((c, i) => {
            return <ClientCard key={i} name={c.name} />;
          })
        ) : (
          <div>
            <h1>No se encontraron clientes activos</h1>
          </div>
        )}
      </div>
      <CreateClient />
    </div>
  );
}
