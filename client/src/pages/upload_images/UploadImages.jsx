import { useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

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
          id: i,
          originalName: file.name,
          index: i,
          URL: typeof reader.result === 'string' ? reader.result : '',
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  const uploadImagesToCloudinary = () => {};

  return (
    <div className="p-6">
      <div className="flex justify-end items-center text-white mb-4">
        <button className='w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium' onClick={() => uploadImagesToCloudinary()}>Subir Imagen</button>
      </div>
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
        <p className="text-lg font-medium mb-2">Arrastra aquí tus imagenes</p>
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
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <div key={i} className="relative w-fit">
            <img
              src={image.URL}
              alt="a image"
              key={i}
              className="w-[500px] aspect-square"
            />
            <button
              onClick={() => removeImages(i)}
              className="absolute top-2 right-2 w-7 h-7 hover:text-red-800 rounded-full hover:bg-gray-400/40"
              title="Eliminar"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  );
}
