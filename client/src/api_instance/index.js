import { api } from "./base_api";

export const API = {
  getClients: () => {
    return api.get("client");
  },
  getCLientById: (clientId) => {
    return api.get(`client/${clientId}`);
  },
  createClient: ( newClient ) => {
    return api.post("client", newClient);
  },
  updateClient: ({ clientId, newData }) => {
    return api.put(`client/${clientId}`, newData);
  },
  deleteClient: ( clientId ) => {
    return api.delete(`client/${clientId}`);
  },
  uploadImagesDB: ({imgs, clientId}) => {
    return api.post("client/imgs", { imgs, clientId });
  },
  getDownloadUrl: (clientId) => {
    return api.get(`cloudinary/download/${clientId}`)
  },
  deleteFolder: (clientId) => {
    return api.delete(`cloudinary/images/${clientId}`)
  },
  isAdmin: (adminId) => {
    return api.get(`admin/verify/${adminId}`)
  },
  connectClient: (clientId) => {
    return api.get(`client/connect/${clientId}`)
  },
  disconnectClient: (clientId) => {
    return api.get(`client/disconnect/${clientId}`)
  },
  getPreviusImgs: (clientId) => {
    return api.get(`client/imgs/${clientId}`)
  }
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
