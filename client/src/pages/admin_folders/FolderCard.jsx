import {
  FolderIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function FolderCard({ name, id }) {
  const params = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState(false);

  function handleDelete() {
    setUrl(false);
    API.deleteFolder(id).then((res) => {
      console.log(res.data);
      API.deleteClient(id).then(() =>
        navigate(`/admin/${params?.adminId}/clients/`)
      );
    });
  }

  useEffect(() => {
    console.log(url);
    if (!url) {
      API.getDownloadUrl(id).then((res) => {
        console.log(res);
        setUrl(res.data);
      });
    }
  }, []);

  return (
    <div className="border-2  w-fit rounded-md px-1">
      <div className="w-fit ml-auto my-1">
        {!url ? (
          <div
            className="inline-block mx-3 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        ) : (
          <a href={url}>
            <ArrowDownTrayIcon className="w-9 inline mx-3 text-green-600 hover:opacity-75" />
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
