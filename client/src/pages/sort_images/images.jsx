import { useApp } from '../../contexts/AppContext';
import { XIcon } from '../upload_images/UploadImages';

export function ShortImages() {
  const { images, removeImages } = useApp();
  return (
    <div>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <div key={i} className="relative w-fit">
            <img
              src={image.url}
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
