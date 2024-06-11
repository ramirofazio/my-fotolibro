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
  const photos_length = images.length;

  while (available > AVAILABLE_SIZE && images.length) {
    const img = images.shift();
    size += img.size;
    available -= img.size;

    const formdata = new FormData();
    const name = img.originalName.trim();

    formdata.append("file", img.file);
    formdata.append("upload_preset", upload_preset);
    formdata.append("asset_folder", `/${clientId}/albm-${id}`);
    formdata.append("public_id", `${clientId}/albm-${id}/000_${name}`);
    // formdata.append("filename_override", `000_${name}`);
    // ? Estar atento al "FILE MODE" utilizado, de ser necesario se puede requerrir las propiedades "filename_override, use_asset_folder_as_public_id_prefix, use_filename_as_display_name"

    promises[id].push(axios.post(URL, formdata));
  }

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
        console.log(data);
        if (data.secure_url && data.existing === false) {
          const photo = {
            URL: data.secure_url,
            originalName: data.display_name,
            size: data.bytes,
            publicId: `${data.public_id}`,
            albumId: parseInt(key),
            clientId: parseInt(clientId),
          };

          if (!data.display_name) {
            const name = data.public_id.split("/")[2];
            photo.originalName = name;
          }
          photos.push(photo);
        }
      });
    }
    return (await API.client.photo.create({ clientId, photos })).data;
  },
};
