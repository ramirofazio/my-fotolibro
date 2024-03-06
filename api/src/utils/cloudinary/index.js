const _cloudinary = require("cloudinary").v2;
const { env } = require("../");

_cloudinary.config({
  api_key: env.cloudinary.API_KEY,
  cloud_name: env.cloudinary.CLOUD_NAME,
  api_secret: env.cloudinary.API_SECRET,
  secure: true,
});


module.exports = _cloudinary;
