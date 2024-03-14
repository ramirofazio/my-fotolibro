require("dotenv").config();
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  DATABASE_URL,
  CLIENT_URL,
  EMAIL_USER,
  ADMIN_EMAIL,
  PORT,
} = process.env;

module.exports = {
  env: {
    cloudinary: {
      API_KEY: CLOUDINARY_API_KEY,
      API_SECRET: CLOUDINARY_API_SECRET,
      CLOUD_NAME: CLOUDINARY_CLOUD_NAME,
    },
    mail: {
      USER: EMAIL_USER,
      ADMIN: ADMIN_EMAIL,
    },
    DATABASE_URL,
    CLIENT_URL,
    PORT,
  },
  check_env: function () {
    const errors = [];

    if (!DATABASE_URL) errors.push("DATABASE_URL: [REQUIRED]");
    if (!CLOUDINARY_API_KEY) errors.push("CLOUDINARY_API_KEY: [REQUIRED]");
    if (!CLOUDINARY_API_SECRET)
      errors.push("CLOUDINARY_API_SECRET: [REQUIRED]");
    if (!CLOUDINARY_CLOUD_NAME)
      errors.push("CLOUDINARY_CLOUD_NAME: [REQUIRED]");
    if (!CLIENT_URL) errors.push("CLIENT_URL: [REQUIRED]");

    if (errors.length) {
      console.log("\nvariables are missing in the .env file.");
      errors.forEach((err) => console.log(err));
      throw "Something went wrong!";
    }
  },
};
