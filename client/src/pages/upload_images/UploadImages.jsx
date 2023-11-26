import { useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getSizeImage, uploadImagesCloudinary } from '../../utils';

export function UploadImages() {
  const { clientId } = useParams();
  const { images, addImages, removeImages, addImagesUploaded, status } =
    useApp();

  function handleImages({ target }) {
    const files = target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const reader = new FileReader();
      let aux = file.name.split('.');
      reader.onload = () => {
        addImages({
          id: images.length + i + 1,
          originalName: aux.slice(0, aux.length - 1).join('.'),
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
    const upImage = await uploadImagesCloudinary(images, clientId);
    addImagesUploaded(upImage);
  };

  return (
    <div className="p-3">
      <div className="flex  flex-col justify-center items-center text-white mt-4 mb-4">
        <h2 className="font-semibold text-2xl">Subi Tus Fotos!</h2>
        <div className="flex flex-col md:flex-row gap-y-2 justify-between w-full">
          <p className="flex flex-col text-lg font-medium">
            <span>Fotos selecionadas: {status.pending + status.uploaded} </span>
            <span>Fotos subidas: {status.uploaded}</span>
            <span>Fotos Pendientes: {status.pending}</span>
          </p>
          {status.pending + status.uploaded === 0 ? (
            <label
              htmlFor="upload-images"
              className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium self-center md:self-end "
            >
              Seleccionar Imagenes
            </label>
          ) : (
            <button
              className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium self-center md:self-end"
              onClick={() => uploadImagesToCloudinary()}
            >
              {status.pending === 0 ? 'Imagenes Subidas' : 'Subir Imagenes'}
            </button>
          )}
        </div>
      </div>
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
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
            <div
              className={`absolute top-0 left-0 w-full p-1 flex justify-between items-center bg-gradient-to-b ${
                !image.upload ? 'from-black/70' : 'from-green-800/70'
              } to-transparent`}
            >
              <p className="flex flex-col">
                <span className="text-sm font-medium">
                  {!image.upload ? 'Imagen no subida' : 'Imagen Subida'}
                </span>
                <span className="text-[12px] text-gray-200">
                  {getSizeImage(image.size)}
                </span>
              </p>
              <button
                onClick={() =>
                  removeImages(i, image.upload ? 'uploaded' : 'pending')
                }
                className=" w-7 aspect-square p-0.5 hover:text-red-800 text-gray-700 rounded-full bg-gray-400/40  hover:bg-gray-400 "
                title="Eliminar"
              >
                <XMarkIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
