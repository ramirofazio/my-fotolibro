import {
  FolderIcon,
  FolderArrowDownIcon,
  XCircleIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { API } from "../../api_instance";
import { useState } from "react";
import { parseDate } from "../../utils/client";
import { Modal } from "../../components/Modal";

export function FolderCard({ clientData, onRemove }) {
  const { name, id, last_link_download, can_download } = clientData;
  const [urls, setUrls] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function generateDownloadUrl() {
    try {
      const urls = await API.getDownloadUrl(id);
      const albums = urls.data.download_urls;
      console.log(albums);
      // albums.reverse();
      setUrls(albums);
      console.log(urls.data.download_urls);
      setIsOpen(true);
    } catch (err) {
      console.log(err);
      setUrls(false);
    }
  }

  return (
    <div className="border-2  rounded-md px-1">
      <Modal
        className="min-w-full "
        isOpen={isOpen}
        onClose={() => {
          API.updateLastDownload(id);
          setIsOpen(false);
        }}
      >
        <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-start-auto gap-4 max-w-[90%]">
          {urls?.length &&
            urls.map((u, i) => {
              return <AlbumCard url={u} key={i} index={i} />;
            })}
        </div>
      </Modal>
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

        <button
          className="text-white text-xl !justify-self-end disabled:opacity-40"
          role="status"
          title="Click para generar desarga"
          onClick={generateDownloadUrl}
          disabled={can_download ? false : true}
        >
          <LinkIcon className="w-9 h-9" />
        </button>
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

function AlbumCard({ index, url }) {
  const [tryDownload, setTryDownload] = useState(false);

  async function handleDownload() {
    // await API.updateLastDownload(id);
    return window.location.replace(url);
  }
  return (
    <div className="border-2  flex flex-col items-center justify-center rounded-lg">
      <h1>
        Descargar <strong>album-{index + 1}</strong>{" "}
      </h1>
      <FolderArrowDownIcon
        id="album_click_download"
        onClick={() => {
          handleDownload();
          setTryDownload(true);
        }}
        className={`h-20 w-20 cursor-pointer ${
          tryDownload ? "text-green-700" : "text-blue-700"
        } `}
      />
    </div>
  );
}
