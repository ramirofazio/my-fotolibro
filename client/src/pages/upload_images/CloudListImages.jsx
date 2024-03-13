import { useEffect } from "react";
import { API } from "../../api_instance";
import { ViewImage } from "./ViewImage";
import { useApp } from "../../contexts/AppContext";
import toast from "react-hot-toast";

export function CloudListImages({ clientId }) {
  const { cloudImages, loading, refresh } = useApp();

  useEffect(() => {
    if (refresh.value) {
      loading.set(true);
      API.getPreviusImgs(clientId)
        .then(({ data }) => {
          cloudImages.set(data.photos);
          loading.set(false);
        })
        .catch((err) => {
          alert(err);
          loading.set(false);
        });
      refresh.off();
    }
  }, []);

  async function onRemove(id, publicId, name) {
    const res = confirm(`¿Quieres eliminar la imagen ${name}?`);
    if (res) {
      loading.set(true);
      const res = await API.client.photo.delete({ id });
      toast.success(res.data);

      //llamar a la api
      const { data } = await API.getPreviusImgs(clientId);
      cloudImages.set(data.photos);
    }

    loading.set(false);
  }

  if (!cloudImages.size) return null;

  return (
    <>
      <h2 className="text-white text-center md:col-span-4 col-span-2 text-xl p-3 sticky top-0 z-50 bg-main/70 backdrop-blur-sm">
        Imagenes Subidas
      </h2>
      {cloudImages.values.map(({ id, ...image }) => (
        <ViewImage
          key={id}
          {...image}
          inCloud={true}
          onRemove={() => onRemove(id, image.publicId, image.originalName)}
        />
      ))}
    </>
  );
}
