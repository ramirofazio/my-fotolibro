import {
  FolderIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {DateTime} from "luxon"

export function FolderCard({ name, id, last_link_download }) {
  const navigate = useNavigate();
  const [url, setUrl] = useState(false);
  

  function handleDelete() {
    setUrl(false);
    API.deleteFolder(id).then((res) => {
      if (res.data) {
        API.deleteClient(id).then(() => {
          navigate(0);
        });
      }
    });
  }

  function generateDownloadUrl() {
    API.addDownloadImgsIndex(id).then((res) => {
      console.log(res.data)
      if (res.data) {
        API.getDownloadUrl(id)
          .then((url) =>{
            console.log(url.data)
             setUrl(url.data)
            })
          .catch(() => {
            setUrl(false);
          });
      }
    });
  }

  //asincrono y esperar + notificacion
  function updateLastDownloadDate() {
    const actual_date = DateTime.now().setLocale("es").toFormat("dd/MM/yyyy")
    API.updateClient({ clientId: id, newData: {last_link_download: actual_date} })
    API.resetCloudinaryIndex(id).then(res => console.log(res))
  }


  return (
    <div className="border-2  w-fit rounded-md px-1">
      <div className="ml-auto my-1 flex gap-2 items-center justify-end ">
        <span className="ml-2  mr-auto">
          <p>Ultima descarga: </p>
          {last_link_download ? (
            <p className=" ml-2 italic text-green-400 mr-auto text-xl">
              {last_link_download}
            </p>
          ) : (
            <p className=" ml-2 italic text-cyan-200 mr-auto ">Sin descargar</p>
          )}
        </span>
        {!url ? (
          <button
            className="text-white text-xl !justify-self-end"
            role="status"
            title="Click para generar desarga"
            onClick={generateDownloadUrl}
          >
            <LinkIcon className="w-9 h-9" />
          </button>
        ) : (
          <a onClick={updateLastDownloadDate} href={url}>
            <ArrowDownTrayIcon className="w-9 inline  text-green-600 hover:opacity-75" />
          </a>
        )}
        <XCircleIcon
          onClick={handleDelete}
          className=" w-9 inline mx-1 text-red-500 hover:opacity-60"
        />
      </div>
      <div className="flex items-center border-t-2 gap-2">
        <FolderIcon className="h-20 w-20 text-blue-700" />
        <div>
          <h1 className="text-white text-2xl">{name}</h1>
          <h2 className="text-white">{id}</h2>
        </div>
      </div>
    </div>
  );
}
