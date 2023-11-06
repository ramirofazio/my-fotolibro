import { useState } from 'react';

export function UploadImages() {
  const [images, setImages] = useState([]);

  function removeImage(index) {
    const Images = images.filter((_img, i) => i !== index);
    setImages(Images);
  }

  function handleImages({ target }) {
    const files = target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const reader = new FileReader();
      reader.onload = () => {
        setImages((cur) => [
          ...cur,
          {
            name: file.name,
            image: typeof reader.result === 'string' ? reader.result : '',
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <div className="">
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
      <div className="p-4">
        {images.map((image, i) => (
          <div key={i} className="relative w-fit">
            <img
              src={image.image}
              alt="a image"
              key={i}
              className="w-[500px] aspect-square"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 text-lg"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
/**
  const imageOnChange = async (e) => {

  const { target } = e;

  const file = target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    setNewImg({
      name: file.name,
      image: typeof reader.result === "string" ? reader.result : "",
      file: file,
    });
    setIsUserChanged(true);
  };
  reader.readAsDataURL(file);
};

function handleUpload () {
  if (newImg) {
    const formdata = new FormData();
    formdata.append("file", newImg.image);
    formdata.append("userId", userId);

    const res = await axios.post(`http://localhost:3000/cloudinary/updateAvatar`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newAvatar = res.data;
  }
}
 */
