import { api } from "./base_api";

export const API = {
  getClients: () => {
    return api.get("client");
  },
  createClient: ({ newClient }) => {
    return api.post("client", newClient);
  },
  updateClient: ({ clientId, newData }) => {
    return api.put(`client/${clientId}`, newData);
  },
  deleteClient: ({ clientId }) => {
    return api.delete(`client/${clientId}`);
  },
  uploadImages: ({ files, clientId }) => {
    return api.post("cloudinary/upload", { files, clientId });
  },
  getBooks: () => {
    return api.get("cloudinary/book");
  },
  getBookImages: ({ clientId, bookId }) => {
    return api.get(`cloudinary/book/${clientId}`);
  },
  deleteBook: ({ clientId, bookId }) => {
    return api.delete("cloudinary/book/:id", { clientId, bookId });
  },
};
