
export function UploadImages() {
  return (
    <div className="w-fit mx-auto">
      <h1 className="text-white text-2xl">Cargue aqui sus imagenes</h1>
      <div className="w-fit">
      <input type="file" accept="image/*" />
      </div>
    </div>
  )
}