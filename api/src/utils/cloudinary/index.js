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
  renameFile: async function ({ public_id, albumId, index }) {
    let newPublicId = public_id.split("/");
    newPublicId[2] = newPublicId[2].split("_");
    newPublicId[2] = getStringWithZeros(index, 4) + "_" + newPublicId[2][1];
    newPublicId[1] = "albm-" + albumId;
    newPublicId = newPublicId.join("/");
    
    await _cloudinary.uploader.rename(public_id, newPublicId);
    
    return newPublicId 
  
  },
};

function getStringWithZeros(num, size) {
  let numString = num.toString();
  const zeros = size - numString.length;
  return "0".repeat(zeros) + numString;
}

module.exports = cloudinary;
