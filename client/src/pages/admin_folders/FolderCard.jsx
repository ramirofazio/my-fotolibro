import {
  FolderIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { parseDate } from "../../utils/client";

export function FolderCard({ clientData, onRemove }) {
  const { name, id, last_link_download, can_download } = clientData;
  const [url, setUrl] = useState(false);
  const { adminClients } = useApp();


  async function generateDownloadUrl() {
    try {
      const url = await API.getDownloadUrl(id);
      console.log("URL:", url.data.download_url[0]);
      setUrl(url.data.download_url[0]);
    } catch (err) {
      console.log(err);
      setUrl(false);
    }
  }

  async function handleDownload() { 
    await API.updateLastDownload(id);
    return window.location.replace(url);
  }

  return (
    <div className="border-2  rounded-md px-1">
      <div className="ml-auto my-1 flex gap-2 items-center justify-end ">
        <span className="ml-2  mr-auto">
          <p>Ultima descarga: </p>
          {last_link_download ? (
            <p className=" ml-2 italic text-green-400 mr-auto text-xl">
              {parseDate(last_link_download)}
            </p>
          ) : (
            <p className=" ml-2 italic text-cyan-200 mr-auto ">Sin descargar</p>
          )}
        </span>
        {!url ? (
          <button
            className="text-white text-xl !justify-self-end disabled:opacity-40"
            role="status"
            title="Click para generar desarga"
            onClick={generateDownloadUrl}
            disabled={can_download ? false : true}
          >
            <LinkIcon className="w-9 h-9" />
          </button>
        ) : (
          <>
            <button onClick={handleDownload}>
              <ArrowDownTrayIcon className="w-9 inline  text-green-600 hover:opacity-75" />
            </button>
          </>
        )}
        <XCircleIcon
          onClick={() => onRemove(name, id)}
          className=" w-9 inline mx-1 text-red-500 hover:opacity-60"
        />
      </div>
      <div className="flex items-center border-t-2 gap-2">
        <FolderIcon
          className={`h-20 w-20 ${
            can_download ? "text-green-700" : "text-blue-700"
          } `}
        />
        <div>
          <h1 className="text-white text-2xl">{name}</h1>
          <h2 className="text-white">{id}</h2>
        </div>
      </div>
      <span className="text-xl font-bold border-t-2 flex items-center justify-center gap-2 py-2">
        {can_download ? (
          <>
            <CheckCircleIcon className="w-7 text-green-700" />
            <h1 className="text-green-600">Listo para descargar</h1>
          </>
        ) : (
          <>
            <ExclamationCircleIcon className="w-7 text-blue-700" />
            <h1 className="text-blue-700">En proceso</h1>
          </>
        )}
      </span>
    </div>
  );
}
