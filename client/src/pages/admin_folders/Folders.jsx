import { FolderCard } from "./FolderCard";
import { useLoaderData } from "react-router-dom";

export function Folders() {
  const folders = useLoaderData();
  console.log(folders)
  return (
    <div className="border-2 my-auto h-screen px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {folders?.length ? (
          folders.map((f, i) => {
            return <FolderCard name={f.name} id={f.id} key={i} />;
          })
        ) : (
          <div className="w-fit">
            <h1 className="text-3xl text-white">
              No se encontraron carpetas con fotos
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
