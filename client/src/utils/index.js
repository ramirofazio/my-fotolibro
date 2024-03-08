import axios from "axios";
import { API } from "../api_instance";
import { getPromisesUpload } from "./cloudinary";

export async function uploadImagesCloudinary(
  images = [],
  clientId,
  upload_preset
) {
  if (!clientId) return;
  //const {upload_preset} = await API.getCLientById(clientId)

  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  const photos = {};
  const promises = [];

  images.forEach(({ file, originalName, upload }) => {
    if (!upload) {
      const formdata = new FormData();
      const indexedName = `000_${originalName}`;
      formdata.append("file", file);
      formdata.append("upload_preset", upload_preset);
      formdata.append("filename_override", originalName.trim());
      formdata.append("public_id", indexedName.trim());
      promises.push(axios.post(URL, formdata));
    }
  });

  try {
    const responses = await Promise.all(promises);
    // AQUI LLEGAN 130 RESPONSES
    responses.forEach(({ data }, i) => {
      if (data.secure_url) {
        if (photos[data.original_filename]) {
          photos[data.original_filename + i] = {
            URL: data.secure_url,
            id: data.asset_id,
            originalName: data.original_filename + i,
            size: data.bytes,
            publicId: `${data.public_id}`,
          };
        } else {
          const name = data.public_id.split('"');
          photos[data.original_filename || name[1]] = {
            URL: data.secure_url,
            id: data.asset_id,
            originalName: data.original_filename || name[1],
            size: data.bytes,
            publicId: `${data.public_id}`,
          };
        }
      }
    });
    console.log(clientId);
    await API.uploadImagesDB({
      clientId,
      imgs: Object.values(photos),
    });
  } catch (err) {
    console.log(err);
  }

  return photos;
}

export function isValidClient({ name, email, dni, phone }) {
  const errs = {};
  if (!name) errs.name = "ingrese un nombre";

  if (!email) errs.email = "ingrese un email";
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|gob|com\.ar|gob\.ar)$/.test(email)
  )
    errs.email = "ingrese un email valido";

  if (!dni) errs.dni = "ingrese DNI";
  if (dni?.length < 7) errs.dni = "ingrese un DNI valido";
  if (dni?.length > 15) errs.dni = "ingrese un DNI Ccatua";

  if (!phone) errs.phone = "ingrese un numero";
  if (phone?.length < 7) errs.phone = "ingrese un numero valido";
  if (phone?.length > 18) errs.phone = "ingrese un numero valido";

  return errs;
}

export function getSizeImage(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export function bytesToMb(bytes) {
  if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) {
    throw new Error("El valor debe ser un número positivo.");
  }

  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2); // Redondear a 2 decimales
}

export const storage = {
  set: ({ name, object, deleted = false }) => {
    if (deleted) {
      localStorage.setItem(name, "");
    } else {
      localStorage.setItem(name, JSON.stringify(object));
    }
  },
  get: ({ name }) => {
    if (name?.length) {
      let object = localStorage.getItem(name);
      return object ? JSON.parse(object) : "null";
    }
    return null;
  },
};
export const cloudinary = {
  upload: async function ({ images = [], clientId, upload_preset }) {
    if (!clientId) return;
    const { data } = await API.client.album.getAll({ clientId });

    const promises = await getPromisesUpload({
      albums: data,
      clientId,
      upload_preset,
      images: [...images],
    });

    const photos = [];
    for (const key in promises) {
      const responses = await Promise.all(promises[key]);

      responses.forEach(({ data }) => {
        if (data.secure_url) {
          const photo = {
            URL: data.secure_url,
            id: data.asset_id,
            originalName: data?.original_filename,
            size: data.bytes,
            publicId: `${data.public_id}`,
            albumId: parseInt(key),
            clientId: parseInt(clientId),
          };

          if (!data.original_filename) {
            const name = data.public_id.split('"');
            photo.originalName = name[0];
          }

          photos.push(photo);
        }
      });
    }

    return (await API.client.photo.create({ clientId, photos })).data;
  },
};
