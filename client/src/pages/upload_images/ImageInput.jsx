import Compressor from "compressorjs";
import toast from "react-hot-toast";
import { useApp } from "../../contexts/AppContext";
import convert from "heic-convert/browser";

export function ImageInput() {
  const { localImages, loading } = useApp();

  async function handleImages({ target }) {
    const files = Object.values(target.files);
    files.reverse();

    if (!files) return;
    loading.set(true);
    const promisesFiles = [];
    const nameFiles = {};

    for (let i = 0; i < files.length; i++) {
      let image = files[i];
      if (!image) continue;

      const formatIndex = image.name.lastIndexOf(".");
      let imageName = image.name.replace(/\.[^/.]+$/, "").replace(/ /g, "");

      const exist =
        nameFiles[imageName.toLowerCase()] || localImages.exist(imageName); // string | false

      if (exist) {
        if (exist === "exist" || imageName === exist) {
          toast.error("La imagen " + imageName + " ya existe");
          continue;
        } else {
          const date = new Date();
          imageName = imageName + "(x)" + date.getMilliseconds();
        }
      }
      nameFiles[imageName.toLowerCase()] = imageName;
      const imageFormat = image.name.substring(formatIndex + 1).toLowerCase();

      if (imageFormat === "heic") {
        const bufferPromise = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            resolve(uint8Array);
          };
          reader.readAsArrayBuffer(image);
        });

        const heic = await convert({
          buffer: bufferPromise,
          format: "JPEG",
          quality: 0.6,
        });

        const blob = new Blob([heic], { type: "" });
        const newImage = new File([blob], imageName + ".jpeg");

        image = newImage;
      }

      promisesFiles.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          if (image.size >= 1000000 && imageFormat !== "heic") {
            // * Si el archivo era .heic, no se comprime
            new Compressor(image, {
              quality: 0.6,
              success: (compressed) => {
                reader.onload = () => {
                  resolve({
                    id: "local-image-" + imageName + (localImages.size + i + 1),
                    originalName: imageName.replace(/ /g, ""),
                    URL: typeof reader.result === "string" ? reader.result : "",
                    file: compressed,
                    size: compressed.size,
                  });
                };
                // if compressed size > 10000000  toast err img muy pesada
                reader.readAsDataURL(compressed);
              },
            });
          } else {
            reader.onload = function () {
              resolve({
                id: "local-image-" + imageName + (localImages.size + i + 1),
                originalName: imageName.replace(/ /g, ""),
                URL: typeof reader.result === "string" ? reader.result : "",
                file: image,
                size: image.size,
              });
            };
            reader.readAsDataURL(image);
          }
        })
      );
    }

    try {
      const res = await Promise.all(promisesFiles);
      localImages.add(res);
      target.value = "";
      loading.set(false);
    } catch (error) {
      console.log(error);
      toast.error(`Algo salio mal - Intenta nuevamente`);
      loading.set(false);
    }
  }
  return (
    <div className="mx-5 text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
      <p className="text-lg font-medium mb-2 hidden sm:block">
        Arrastra aquí tus imagenes
      </p>
      <label
        htmlFor="upload-images"
        className="w-fit text-center cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
      >
        Seleccionar Imagenes
      </label>
      <input
        className=" invisible w-full h-full border  absolute top-0 right-0"
        id="upload-images"
        type="file"
        accept="*"
        multiple
        onChange={handleImages}
      />
    </div>
  );
}
