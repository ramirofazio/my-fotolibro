import { useEffect, useState } from "react";
import axios from "axios";

export function UploadImages() {

  const [imgs, setImgs] = useState({})

  useEffect(() => {
    console.log(imgs)
  }, [imgs])

  async function handleImgsUpload (files) {
    let links = []; 

    for(const img in files) {
      console.log(files[img].name)
      const formData = new FormData
      formData.append("file", files[img])
      formData.append("upload_preset", "random")
      formData.append("public_id", img)
      const {data} = await axios.post("https://api.cloudinary.com/v1_1/dnxa8khx9/image/upload", formData)
      console.log(data)
      links.push(data.secure_url)
    }

    return links
  }


  function handleImgs(e) {
    const {target} = e

    for(let i = 0; i < target.files.length; i++) {
      const file = target.files[i];
      setImgs((prev) => {
        return {
         ...prev,
         [file.name]: file
       }
     });
      /* const reader = new FileReader();
      reader.onload = () => {
        setImgs((prev) => {
         return {
          ...prev,
          [file.name]: typeof reader.result === "string" ? reader.result : "",
        }
      });
      };
      reader.readAsDataURL(file); */
    }
  }

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
          onChange={handleImgs}
          className=" w-full h-full absolute top-0 right-0"
          id="upload-images"
          type="file"
          accept="image/*"
          multiple="true"
        />
      </div>
      <button onClick={async () => {
        let links = await handleImgsUpload(imgs)
        console.log(links)
        /* console.log(imgs)
        const imgFormData = new FormData()
        for (const i in imgs) {
          imgFormData.append(i, imgs[i])
        }
        for(let [name, value] of imgFormData) {
          console.log(`${name} = ${value}`); 
        }
        let res = await axios.post(`http://localhost:3001/cloudinary/upload`,  imgFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data) */
      }}>
        Mandaleeeeeeeee
      </button>
    </div>
  );
}
