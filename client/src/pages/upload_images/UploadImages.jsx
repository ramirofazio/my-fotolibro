export function UploadImages() {
  return (
    <div className="">
      <div className="text-white border-dashed border relative overflow-hidden flex flex-col justify-center items-center  p-4">
        <p className="text-lg font-medium">Arrastra aquí tus imagenes</p>
        <label htmlFor="upload-images" className="w-fit">
          <button className="cursor-pointer  bg-blue-700 px-5 py-3 rounded">
            Seleccionar Imagenes
          </button>
        </label>
        <input
          className="invisible w-full h-full absolute top-0 right-0"
          id="upload-images"
          type="file"
          accept="image/*"
          multiple=""
        />
      </div>
    </div>
  );
}
