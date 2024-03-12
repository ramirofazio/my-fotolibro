import Compressor from "compressorjs";
import toast from "react-hot-toast";
import { useApp } from "../../contexts/AppContext";

export function ImageInput() {
  const { localImages, loading } = useApp();

  async function handleImages({ target }) {
    const files = target.files;
    if (!files) return;
    loading.set(true);
    const promisesFiles = [];
    const nameFiles = {};

    for (let i = 0; i < files.length; i++) {
      const image = files[i];
      if (!image) continue;

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

      promisesFiles.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          if (image.size >= 8000000) {
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
      loading.set(false);
    } catch (error) {
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
        className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
      >
        Seleccionar Imagenes
      </label>
      <input
        className=" invisible w-full h-full border  absolute top-0 right-0"
        id="upload-images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImages}
      />
    </div>
  );
}
