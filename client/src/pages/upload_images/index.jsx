import { useParams } from "react-router-dom";
import { CloudListImages } from "./CloudListImages";
import { ImageInput } from "./ImageInput";
import { LocalListImages } from "./LocalListImages";
import { useApp } from "../../contexts/AppContext";
import { useEffect } from "react";
import { useNavigation } from "../../contexts/NavigationContext";
import { cloudinary } from "../../utils/cloudinary";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { API } from "../../api_instance";

export function SelectImagesPage() {
  const { clientId } = useParams();
  const { localImages, cloudImages, loading, client } = useApp();
  const { setStepContinue } = useNavigation();

  useEffect(() => {
    if (localImages.size > 0)
      setStepContinue({ value: false, msg: "Imagenes pendientes por subir" });
    else if (!localImages.size && !cloudImages.size) {
      setStepContinue({ value: false, msg: "Sin imagenes por ordernar" });
    } else setStepContinue({ value: true });
  }, [cloudImages.size, localImages.size]);

  const uploadToCloudinary = async () => {
    if (!localImages.size) return;
    loading.set(true);
    try {
      await cloudinary.upload({
        images: localImages.values,
        clientId,
        upload_preset: client.upload_preset,
      });
      const { data } = await API.client.photo.getAll({ clientId });
      cloudImages.set(data.photos);
      localImages.clear();
      loading.set(false);
    } catch (error) {
      loading.set(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-y-2 justify-between w-full my-6 px-4">
        <table className=" text-white w-fit text-lg mb-5">
          <tr>
            <th className="text-xl">Fotos seleccionadas</th>
          </tr>
          <tr>
            <th className="text-left">Subidas</th>
            <td className="text-right">{cloudImages.size}</td>
          </tr>
          <tr>
            <th className="text-left">Pendientes</th>
            <td className="text-right">{localImages.size}</td>
          </tr>
          <tr>
            <th className="text-left">Total</th>
            <td className="text-right">
              {localImages.size + cloudImages.size}
            </td>
          </tr>
        </table>
        <UploadButton
          total={localImages.size + cloudImages.size}
          pending={localImages.size}
          onUpload={uploadToCloudinary}
        />
      </div>
      <ImageInput />
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-2">
        <LocalListImages />
        <CloudListImages clientId={clientId} />
      </div>
    </>
  );
}

function UploadButton({ total, pending, onUpload }) {
  if (!total) return null;

  return (
    <button
      className={`w-fit cursor-pointer text-xl text-white ${
        pending === 0 ? "bg-green-600" : "bg-blue-700"
      } px-5 py-3 rounded hover:font-medium self-center md:self-end `}
      onClick={() => onUpload()}
    >
      <span className={`flex gap-2 items-center ${"animate-pulse"}`}>
        {pending === 0
          ? "Imagenes subidas, seleccione mas o pase a ordenar"
          : "Subir imagenes"}
        <CloudArrowUpIcon className="w-8 aspect-square " />
      </span>
    </button>
  );
}
