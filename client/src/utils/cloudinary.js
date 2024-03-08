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

  await API.client.album.update({ id, size, available });

  return await getPromisesUpload({
    clientId,
    upload_preset,
    albums: albums.slice(1),
    images,
    promises,
  });
}
