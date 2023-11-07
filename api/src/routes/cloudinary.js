require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary");
const router = Router();
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
  process.env;
const { Client, Book } = require("../db.js");

router.get("/signature", (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      },
      `${CLOUDINARY_API_SECRET}`
    );
    res.json({
      timestamp,
      signature,
    });
  } catch (err) {
    res.json({
      err,
    });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { files, userId, upload_preset } = req.body;// pasarlo a una funcion, que cree una promesa por cada img y las resuelva
    console.log("ENTRO A LA RUTA")
    let promises = []
    for (const imgName in files) {
      console.log(imgName)
      promises.push(cloudinary.uploader.upload(files[imgName], {
        upload_preset: "testing",
        public_id: userId,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      }));
      /* const result = await cloudinary.uploader.upload(files[imgName], {
        upload_preset: upload_preset,
        public_id: userId,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      }); */
    }
    res.send(result.secure_url);
  } catch (err) {
    console.log(e);
    res.json({
      err,
    });
  }
});

router.get("/book", async (req, res) => {
  const books = await Book.findAll()
  return res.json({
    books
  })
});

router.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  await cloudinary.uploader.destroy({
    public_id,
  });
});


router.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    cloudinary.utils();
  } catch (err) {
    console.log(err);
    res.json({
      err,
    });
  }
});

router.put("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Book.update(
      { ...req.body },
      {
        where: { id },
      }
    );
  } catch (err) {
    console.log(err);
    res.json({
      err,
    });
  }
});

router.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    cloudinary.utils();
  } catch (err) {
    console.log(err);
    res.json({
      err,
    });
  }
});

module.exports = router;