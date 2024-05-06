import { toast } from "react-hot-toast";
import { API } from "../../api_instance";
import {
  PaperAirplaneIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { SortImages } from "./sort_images";
import { handleClosing } from "../../utils/client";

export function SortImagesPage() {
  const [trySort, setTrySort] = useState(false);
  const [visibleOrder, setVisibleOrder] = useState(true);
  const orderRef = useRef();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { loading, cloudImages, refresh } = useApp();

  useEffect(() => {
    if (refresh.value) {
      loading.set(true);
      API.getPreviusImgs(clientId)
        .then(({ data }) => {
          if (data.photos.length) {
            cloudImages.set(data.photos);
          } else {
            toast.error("Uups, Imagenes no cargadas");
            navigate(`/client/${clientId}/upload_images`);
          }
          loading.set(false);
        })
        .catch((err) => {
          alert(err);
          loading.set(false);
        });

      refresh.off();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleOrder(false);
        } else {
          setVisibleOrder(true);
        }
      });
    });

    observer.observe(orderRef.current);

    return () => observer.disconnect();
  }, []);

  function sortImages() {
    toast.promise(
      API.client.photo.update_indexes({ photos: cloudImages.values }),
      {
        loading: "Ordenando fotos.",
        success: "Las imagenes fueron ordenadas",
        error: "Algo salio mal, Intenta de nuevo",
      }
    );
    setTrySort(false);
  }

  async function submitBook() {
    try {
      loading.set(true);
      window.removeEventListener("beforeunload", handleClosing(clientId));
      await API.client.photo.update_indexes({ photos: cloudImages?.values });
      await API.finishUpload({
        clientId,
        photos_length: cloudImages.values?.length,
      });
      API.client.photo.send({ clientId });
      loading.set(false);
      navigate("/success");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  async function onRemove(id, publicId, name) {
    const res = confirm(`¿Quieres eliminar la imagen ${name}?`);
    if (res) {
      loading.set(true);

      const res = await API.client.photo.delete({ id });
      toast.success(res.data);

      const { data } = await API.getPreviusImgs(clientId);
      cloudImages.set(data.photos);
    }

    loading.set(false);
  }

  return (
    <section className="border-2 border-transparent">
      <h2 className="w-fit text-white text-xl mx-auto my-2 text-center px-6">
        Guarde el orden deseado para las fotos abajo del todo{" "}
        <div className="animate-bounce mt-3">👇</div>
      </h2>

      <SortImages
        cloudImages={cloudImages.values}
        updateIndex={(images) => {
          setTrySort(true);
          cloudImages.set(images);
        }}
        onRemove={onRemove}
      />
      <div className="w-[80%] mx-auto my-10  flex flex-col items-center  md:items-center  md:flex-row  gap-4 px-6">
        <button
          disabled={!trySort}
          ref={orderRef}
          onClick={sortImages}
          className="w-full  text-white sm:text-xl  cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Ordenar y continuar mas tarde
          <AdjustmentsHorizontalIcon className="w-10 sm:w-8 aspect-square stroke-2" />
        </button>
        <button
          id="finish"
          onClick={() => {
            const res = confirm(
              `¿Quieres enviar las imagenes? \n Una vez enviadas no podras agregar ni ordenar más y el link quedara inhabilitado!`
            );
            if (res)
              toast.promise(submitBook(), {
                loading: "Enviando Imagenes",
                success: "Las imagenes fueron Enviadas",
                error: "Algo salio mal, Intenta de nuevo",
              });
          }}
          className="w-full relative sm:text-xl  justify-center  disabled:opacity-50  font-bold bg-green-600 text-white border-2  h-full  cursor-pointer border-green-800 px-5 py-3 rounded hover:font-medium flex items-center gap-2 "
        >
          Finalizar y enviar Book
          <PaperAirplaneIcon className="w-10 sm:w-8 aspect-square stroke-2" />
        </button>
      </div>
      <p className="text-lg lg:text-2xl my-10 text-white underline  p-0 text-center">
        Recuerde cerrar la ventana una vez haya finalizado!
      </p>
      {trySort && visibleOrder && (
        <button
          onClick={sortImages}
          className="w-fit text-white fixed bottom-6 right-6 cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium flex items-center justify-center gap-2 "
          disabled={!trySort}
        >
          <ListBulletIcon className="w-6 aspect-square stroke-2" />
          Guardar Orden
        </button>
      )}
    </section>
  );
}
