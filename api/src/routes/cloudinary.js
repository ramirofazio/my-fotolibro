require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary");
const router = Router();
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
  process.env;
const { Client, Book, Photo } = require("../db.js");

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

router.get("/download/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    const download_url = await cloudinary.v2.utils.download_folder(clientId, {
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      prefixes: "/",
      target_public_id: client?.name,
    });

    return res.send(download_url);
  } catch (e) {
    console.log(e);
    return res.json({
      e,
    });
  }
});

router.get("/folders", async (req, res) => {
  try {
    const { clientId } = req.params;
    const folders = await cloudinary.v2.api.root_folders({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });

    return res.json({
      res: folders,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      e,
    });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { files } = req.body; // pasarlo a una funcion, que cree una promesa por cada img y las resuelva

    for (let [name, value] of files) {
      console.log(`${name} = ${value}`);
    }
    let promises = [];
    /* for (const imgName in files) {
      console.log(imgName)
      promises.push(cloudinary.uploader.upload(files[imgName], {
        upload_preset: "testing",
        public_id: userId,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      }));
    } */
    /* const result = await cloudinary.uploader.upload(files[0], {
      upload_preset: "test",
      public_id: "el primer user",
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      overwrite: true,
    });
    console.log(result) */
    res.json({
      res: files,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err,
    });
  }
});

router.delete("/images/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });

    const folder = await cloudinary.v2.search
      .expression(`folder=${clientId}`)
      .sort_by("public_id", "desc")
      .execute();
    const public_ids = folder.resources.map((asset) => asset.public_id);

    const deleted_assets = await cloudinary.v2.api.delete_resources(
      public_ids,
      {
        all: true,
      }
    );

    const deleted_folder = await cloudinary.v2.api.delete_folder(clientId);
    const delete_upload_preset = await cloudinary.v2.api.delete_upload_preset(
      clientId
    );

    res.json({
      res: public_ids,
      deleted_assets,
      deleted_folder,
      delete_upload_preset,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "cannot delete folder",
      err: error,
    });
  }
});

router.post("/delete/single_img", async (req, res) => {
  try {
    const { publicId, id } = req.body;
    console.log(req.body);
    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });

    const deleted_cloudinary = await cloudinary.v2.api.delete_resources(
      [publicId],
      {}
    );

    const deleted_db = await Photo.destroy({
      where: { id },
    });

    res.json({
      deleted_cloudinary,
      deleted_db,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "cannot delete folder",
      err: error,
    });
  }
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

router.post("/reset_cloudinary_index/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const photos = await Photo.findAll({
      where: { clientId },
    });

    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });

    photos.map(async (p) => {
      try {
        const [folder, originalName] = p?.publicId.split("/");
        const oldIndex = originalName.slice(0, 4);
        console.log("old", oldIndex);
        if (oldIndex === "000-") return;

        let resetedIndex = originalName.replace(oldIndex, "000-");
        const newImg = await cloudinary.v2.uploader.rename(
          p?.publicId,
          `${folder}/${resetedIndex}`,
          {}
        );
        const dbPhoto = await Photo.findByPk(p.id);
        const dbUpdate = await dbPhoto.update({ publicId: newImg.public_id });
        return { newImg, dbUpdate };
      } catch (e) {
        console.log(e);
      }
    });
    return res.json({
      photos,
    });
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      e,
    });
  }
});

router.post("/sort_download_imgs/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const photos = await Photo.findAll({
      where: { clientId },
    });

    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });

    await photos.map(async (p) => {
      try {
        const [folder, originalName] = p?.publicId.split("/");
        let index = `${p.index}`;
        let newIndex = "";

        if (p.index === 0) return;
        else if (index?.length === 1) newIndex = `00${index}-`;
        else if (index?.length === 2) newIndex = `0${index}-`;
        else if (index?.length === 3) newIndex = `${index}-`;

        const indexedName = originalName.replace("000-", newIndex);
        console.log("modified", indexedName);

        const newImg = await cloudinary.v2.uploader.rename(
          p?.publicId,
          `${folder}/${indexedName}`,
          {}
        );
        const dbPhoto = await Photo.findByPk(p.id);
        const dbUpdate = await dbPhoto.update({ publicId: newImg.public_id });

      } catch (e) {
        console.log(e);
      }
    });

    return res.json({
      photos,
    });
  } catch (e) {
    console.log(e);
    const { clientId } = req.body;
    return res.status(401).json({
      e,
      clientId,
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
