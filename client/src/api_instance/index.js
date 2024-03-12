import { api } from "./base_api";
console.log(api);
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
  updateClient: ({ clientId, newClient }) => {
    return api.put(`client/edit_client/${clientId}`, newClient);
  },
  deleteClient: (clientId) => {
    return api.delete(`client/${clientId}`);
  },
  deleteFolder: (clientId) => {
    return api.delete(`cloudinary/images/${clientId}`);
  },
  uploadImagesDB: ({ imgs, clientId }) => {
    console.log("manda: ", imgs.length);
    return api.post("client/imgs", { imgs, clientId });
  },
  getDownloadUrl: (clientId) => {
    return api.get(`cloudinary/download/${clientId}`);
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
  addCloudImgsIndex: (clientId) => {
    return api.post(`cloudinary/add_cloud_imgs_index/${clientId}`);
  },
  deleteSingleImg: ({ publicId, id }) => {
    return api.post(`cloudinary/delete/single_img/`, { publicId, id });
  },
  updateActiveClient: (clientId) => {
    return api.put(`client/activeClient/${clientId}`);
  },
  canFinish: (clientId) => {
    return api.get(`client/canFinish/${clientId}`);
  },
  finishUpload: ({ clientId, photos_length }) => {
    return api.post(`client/finish_upload/`, {
      clientId,
      photos_length,
    });
  },
  updateLastDownload: function () {
    return api.put("/client/timestamp/:clientId");
  },
  resetCloudinaryIndex: (clientId) => {
    return api.post(`cloudinary/reset_cloudinary_index/${clientId}`);
  },
  session: {
    connect: function ({ clientId, deviceId = null }) {
      return api.post("/session", {
        clientId,
        deviceId,
      });
    },
    forceConnect: function ({ deviceId = null, clientId }) {
      return api.post("/session/force", {
        clientId,
        deviceId,
      });
    },
    disconnect: function ({ deviceId = null }) {
      return api.post("/session/off", { deviceId });
    },
  },
  client: {
    album: {
      getAll: function ({ clientId }) {
        return api.get("/client/albums/" + clientId);
      },
      create: function ({ clientId }) {
        return api.post("/client/albums/" + clientId);
      },
      update: function ({ id, size, available, photos_length }) {
        return api.put("/client/albums/" + id, {
          size,
          available,
          photos_length,
        });
      },
    },
    photo: {
      create: function ({ clientId, photos }) {
        return api.post("client/photos/" + clientId, { photos });
      },
      getAll: function ({ clientId }) {
        return api.get("/client/photos/" + clientId);
      },
      update_indexes: function ({ photos }) {
        return api.put("/client/photos/update_index", { photos });
      },

      send: function ({ clientId }) {
        return api.post("/client/photos/send/" + clientId);
      },
      delete: function ({ id }) {
        return api.delete("/client/photo/" + id);
      },
    },
  },
};
