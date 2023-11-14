import { FolderCard } from "./FolderCard";
import { useLoaderData } from "react-router-dom";

export function Folders() {
  const folders = useLoaderData()
  console.log(folders)
  return (
    <div className="border-2 my-auto">
      <h1>Carpetas actuales: </h1>
      {folders?.length ? (
        folders.map((f, i) => {
          return <FolderCard name={f.name} id={f.id} key={i} />;
        })
      ) : (
        <div>
          <h1>No se encontraron books</h1>
        </div>
      )}
    </div>
  );
}
