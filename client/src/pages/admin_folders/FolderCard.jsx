import {
  FolderIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useEffect } from "react";

export function FolderCard({ name, id }) {

  function handleDownload(clientId) {
    
  }

  let download_url = ""

  useEffect(() => {
    API.getDownloadUrl(id).then(res => {
      console.log(res)
      download_url = res.data
    })
  }, [])

  return (
    <div className="border-2  w-fit rounded-md px-1">
      <div className="w-fit ml-auto ">
        <ArrowDownTrayIcon className="w-8 inline mx-3 text-green-600" />
        <XCircleIcon className="w-8 inline mx-1 text-red-500" />
      </div>
      <div className="flex items-center border-t-2">
        <FolderIcon className="h-20 w-20 text-blue-700" />
        <div>
          <h1 className="text-white">{name}</h1>
          <h2 className="text-white">{id}</h2>
        </div>
      </div>
    </div>
  );
}
