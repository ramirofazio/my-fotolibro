import {
  FolderIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function FolderCard({ name, id }) {
  const params = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState(false);


  function handleDelete() {
    setUrl(false);
    API.deleteFolder(id).then((res) => {
      if(res.data) {

        API.deleteClient(id).then(() =>
          {
            navigate(0)
            //navigate(`/admin/${params?.adminId}/folders/`)
          }
        );
      }
    });
  }

  function generateDownloadUrl() {
    API.addDownloadImgsIndex(id)
    .then(res => {
      console.log("index", res.data)
      if(res.data) {
        API.getDownloadUrl(id)
        .then(url => setUrl(url.data))
        .catch(() => {
          setUrl(false)
        })
      }
    })
  }


  return (
    <div className="border-2  w-fit rounded-md px-1">
      <div className="w-fit ml-auto my-1 flex gap-2">
      {!url ? (
          <button
            className="text-white text-xl "
            role="status"
            title="Click para generar desarga"
            onClick={generateDownloadUrl}
          >
            <LinkIcon className="w-9 h-9"/>
          </button>
        ) : (
          <a href={url}>
            <ArrowDownTrayIcon className="w-9 inline  text-green-600 hover:opacity-75" />
          </a>
        )}
        <XCircleIcon
          onClick={handleDelete}
          className="w-9 inline mx-1 text-red-500 hover:opacity-60"
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
