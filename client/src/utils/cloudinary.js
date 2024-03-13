import axios from "axios";
import { API } from "../api_instance";

const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
const AVAILABLE_SIZE = 5000000; //5MB

export async function getPromisesUpload({
  clientId,
  upload_preset,
  albums,
  images,
  promises = {},
}) {
  if (!images.length) return promises;
  if (!albums.length) {
    albums = (await API.client.album.create({ clientId })).data;
  }

  let { size, available, id } = albums[0];
  promises[id] = [];
  const photos_length = images.length
  console.log(photos_length )
  //await API.client.album.update({ id, size, available, photos_length });
  while (available > AVAILABLE_SIZE && images.length) {
    const img = images.shift();
    size += img.size;
    available -= img.size;

    const formdata = new FormData();
    const name = img.originalName.trim();
    formdata.append("file", img.file);
    formdata.append("upload_preset", upload_preset);
    formdata.append("filename_override", name);
    formdata.append("public_id", "albm-" + id + "/" + "000_" + name);

    promises[id].push(axios.post(URL, formdata));
  }
  
  console.log(photos_length, "ya supidte")
  await API.client.album.update({ id, size, available, photos_length });

  return await getPromisesUpload({
    clientId,
    upload_preset,
    albums: albums.slice(1),
    images,
    promises,
  });
}

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

// en deuso
// export async function uploadImagesCloudinary(
//   images = [],
//   clientId,
//   upload_preset
// ) {
//   if (!clientId) return;

//   const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

//   const URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

//   const photos = {};
//   const promises = [];

//   images.forEach(({ file, originalName, upload }) => {
//     if (!upload) {
//       const formdata = new FormData();
//       const indexedName = `000_${originalName}`;
//       formdata.append("file", file);
//       formdata.append("upload_preset", upload_preset);
//       formdata.append("filename_override", originalName.trim());
//       formdata.append("public_id", indexedName.trim());
//       promises.push(axios.post(URL, formdata));
//     }
//   });

//   try {
//     const responses = await Promise.all(promises);

//     responses.forEach(({ data }, i) => {
//       if (data.secure_url) {
//         if (photos[data.original_filename]) {
//           photos[data.original_filename + i] = {
//             URL: data.secure_url,
//             id: data.asset_id,
//             originalName: data.original_filename + i,
//             size: data.bytes,
//             publicId: `${data.public_id}`,
//           };
//         } else {
//           const name = data.public_id.split('"');
//           photos[data.original_filename || name[1]] = {
//             URL: data.secure_url,
//             id: data.asset_id,
//             originalName: data.original_filename || name[1],
//             size: data.bytes,
//             publicId: `${data.public_id}`,
//           };
//         }
//       }
//     });
  
//     await API.uploadImagesDB({
//       clientId,
//       imgs: Object.values(photos),
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   return photos;
// }