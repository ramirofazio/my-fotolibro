import { useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getSizeImage, uploadImagesCloudinary } from '../../utils';

export function UploadImages() {
  const { clientId } = useParams();
  const { images, addImages, removeImages } = useApp();

  function handleImages({ target }) {
    const files = target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const reader = new FileReader();
      reader.onload = () => {
        addImages({
          id: images.length + i + 1,
          originalName: file.name,
          URL: typeof reader.result === 'string' ? reader.result : '',
          file: file,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  const uploadImagesToCloudinary = async () => {
    if (!images[0]) return;
    console.log(images[0]);
    const upImage = await uploadImagesCloudinary([images[0]]);
  };

  return (
    <div className="p-3">
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
        <p className="text-lg font-medium mb-2 hidden">
          Arrastra aquí tus imagenes
        </p>
        <label
          htmlFor="upload-images"
          className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
        >
          Seleccionar Imagenes
        </label>
        <input
          className="invisible w-full h-full absolute top-0 right-0"
          id="upload-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, i) => (
          <div key={i} className="relative w-fit">
            <img
              src={image.URL}
              alt="a image"
              key={i}
              className="w-[500px] aspect-square object-cover"
            />
            <div className="absolute top-0 left-0 w-full p-1 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
              <p className="flex flex-col">
                <span className="text-sm font-medium">Imagen no subida</span>
                <span className="text-[12px] text-gray-200">
                  {getSizeImage(image.size)}
                </span>
              </p>
              <button
                onClick={() => removeImages(i)}
                className=" w-7 aspect-square p-0.5 hover:text-red-800 text-gray-700 rounded-full bg-gray-400/40  hover:bg-gray-400 "
                title="Eliminar"
              >
                <XMarkIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center text-white mt-4">
        <button
          className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
          onClick={() => uploadImagesToCloudinary()}
        >
          Subir Imagenes
        </button>
      </div>
    </div>
  );
}
