import { api } from "./base_api";

export const API = {
  getClients: () => {
    return api.get("client");
  },
  getCLientById: (clientId) => {
    return api.get(`client/${clientId}`);
  },
  createClient: (newClient) => {
    return api.post("client", newClient);
  },
  updateClient: ({ clientId, newData }) => {
    return api.put(`client/edit_client/${clientId}`, newData);
  },
  deleteClient: (clientId) => {
    return api.delete(`client/${clientId}`);
  },
  uploadImagesDB: ({ imgs, clientId }) => {
    return api.post("client/imgs", { imgs, clientId });
  },
  getDownloadUrl: (clientId) => {
    return api.get(`cloudinary/download/${clientId}`);
  },
  deleteFolder: (clientId) => {
    return api.delete(`cloudinary/images/${clientId}`);
  },
  isAdmin: (adminId) => {
    return api.get(`admin/verify/${adminId}`);
  },
  connectClient: (clientId) => {
    return api.get(`client/connect/${clientId}`);
  },
  disconnectClient: (clientId) => {
    return api.get(`client/disconnect/${clientId}`);
  },
  getPreviusImgs: (clientId) => {
    return api.get(`client/imgs/${clientId}`);
  },
  addImgsIndex: (imgs) => {
    return api.put(`client/index_images`, { imgs });
  },
  addDownloadImgsIndex: (clientId) => {
    return api.post(`cloudinary/sort_download_imgs/${clientId}`);
  },
  deleteSingleImg: ({ publicId, id }) => {
    //console.log(JSON.stringify(publicId));
    console.log(publicId, id);
    return api.post(`cloudinary/delete/single_img/`, {publicId, id});
  },
  updateActiveClient: (clientId) => {
    return api.put(`client/activeClient/${clientId}`);
  },
  /* getBooks: () => {
    return api.get("cloudinary/book");
  },
  getBookImages: ({ clientId, bookId }) => {
    return api.get(`cloudinary/book/${clientId}`);
  },
  deleteBook: ({ clientId, bookId }) => {
    return api.delete("cloudinary/book/:id", { clientId, bookId });
  }, */
};
