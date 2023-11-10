import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../api_instance';
import axios from 'axios';

export function UploadImages() {
  const { clientId } = useParams();
  const [imgs, setImgs] = useState({});

  async function handleImgsUpload(files) {
    let links = [];
    let mockCounter = 1;
    let imgsDB = [];
    // setLoader
    for (const img in files) {
      try {
        const formData = new FormData();
        formData.append('file', files[img]);
        formData.append('upload_preset', clientId);
        formData.append('public_id', img);
        const { data } = await axios.post(
          'https://api.cloudinary.com/v1_1/dnxa8khx9/image/upload',
          formData
        );
        imgsDB.push({
          URL: data.secure_url,
          index: mockCounter,
          originalName: img,
        });
        links.push(data.secure_url);
        mockCounter = mockCounter + 1;
      } catch (e) {
        console.log(e);
      }
    }
    // setLoader
    const res = await API.uploadImagesDB({ clientId, imgs: imgsDB });
    console.log(res);
    return links;
  }

  function handleImgs(e) {
    const { target } = e;
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files[i];
      setImgs((prev) => {
        return {
          ...prev,
          [file.name]: file,
        };
      });
    }
  }

  return (
    <div className="p-6">
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
        <p className="text-lg font-medium mb-2">Arrastra aquí tus imagenes</p>
        <label
          htmlFor="upload-images"
          className="w-fit cursor-pointer bg-blue-700 px-5 py-3 rounded hover:font-medium"
        >
          Seleccionar Imagenes
        </label>
        <input
          onChange={handleImgs}
          className=" w-full h-full absolute top-0 right-0"
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
