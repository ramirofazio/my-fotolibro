import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {API} from "../../api_instance"
import axios from "axios";

export function UploadImages() {
  const { clientId } = useParams()
  console.log(clientId)
  const [imgs, setImgs] = useState({})

  useEffect(() => {
    console.log(imgs)
  }, [imgs])

  async function handleImgsUpload (files) {
    let links = [];
    let mockCounter = 1 
    let imgsDB = []
    // setLoader
    for(const img in files) {
      try {
        console.log(files[img].name)
        const formData = new FormData
        formData.append("file", files[img])
        formData.append("upload_preset", clientId)
        formData.append("public_id", img)
        const {data} = await axios.post("https://api.cloudinary.com/v1_1/dnxa8khx9/image/upload", formData)
        console.log(data)
        imgsDB.push({
          URL: data.secure_url,
          index: mockCounter,
          originalName: img
        })
        links.push(data.secure_url)
        mockCounter = mockCounter + 1
      } catch(e) {
        console.log(e)
      }
    }
    // setLoader
    const res = await API.uploadImagesDB({clientId, imgs: imgsDB})
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
      <button onClick={() => handleImgsUpload(imgs)}>
        Mandaleeeeeeeee
      </button>
    </div>
  );
}
