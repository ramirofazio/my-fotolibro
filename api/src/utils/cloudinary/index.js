const _cloudinary = require("cloudinary").v2;
const { env } = require("../env");

_cloudinary.config({
  api_key: env.cloudinary.API_KEY,
  cloud_name: env.cloudinary.CLOUD_NAME,
  api_secret: env.cloudinary.API_SECRET,
  secure: true,
});

const cloudinary = {
  createFolder: async function ({ clientId, albumId }) {
    const response = await _cloudinary.api.create_folder(
      `${clientId}/albm-${albumId}`
    );
    return response;
  },
  deleteFile: async function ({ public_id }) {
    const response = await _cloudinary.api.delete_resources([public_id], {});

    return response;
  },
};

module.exports = cloudinary;
