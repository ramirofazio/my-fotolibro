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
    const zipName = client?.name.trim().toLowerCase();
    console.log(zipName);
    const download_url = await cloudinary.v2.utils.download_folder(clientId, {
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      prefixes: "/",
      target_public_id: zipName,
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

router.delete("/images/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });
    const folder = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: clientId,
      max_results: 400,
    });
    if (!folder.resources.length) return;
    const public_ids = folder.resources.map((asset) => asset.public_id);
    console.log(public_ids.length);

    const subArrNum = Math.ceil(public_ids.length / 100);
    console.log(subArrNum);
    let deleted_assets = [];
    for (let i = 0; i < subArrNum; i++) {
      try {
        let begin = i * 100;
        let slice = public_ids.slice(begin, begin + 100);
        const res = await cloudinary.v2.api.delete_resources(slice, {
          all: true,
        });
        deleted_assets.push(res.data);
      } catch (e) {
        console.log(e);
      }
    }

    const deleted_folder = await cloudinary.v2.api.delete_folder(clientId);
    /* const delete_upload_preset = await cloudinary.v2.api.delete_upload_preset(
      clientId
    );
 */
    res.json({
      res: public_ids,
      deleted_assets,
      deleted_folder,
      // delete_upload_preset,
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

    let totalSlices = [];
    const slices = Math.ceil(photos.length / 5);
    let sliceSize = photos.length / slices; // 5

    for (let i = 0; i < slices; i++) {
      let begin = i * sliceSize;
      let slice = photos.slice(begin, begin + sliceSize);
      await new Promise((resolve) => setTimeout(resolve, 200));
      const newImgs = slice.map(async (p) => {
        try {
          const [folder, originalName] = p?.publicId.split("/");
          const oldIndex = originalName.slice(0, 4);
          console.log("old", oldIndex);
          if (oldIndex === "000_") return;

          let resetedIndex = originalName.replace(oldIndex, "000_");
          const newImg = await cloudinary.v2.uploader.rename(
            p?.publicId,
            `${folder}/${resetedIndex}`,
            {}
          );
          const dbPhoto = await Photo.findByPk(p.id);
          const dbUpdate = await dbPhoto.update({ publicId: newImg.public_id });
          return { newImg, dbUpdate };
        } catch (e) {
          console.log("no encontro", p);
          console.log(e);
        }
      });
      totalSlices.push(newImgs);
    }
    return res.json({
      photos: totalSlices,
    });
  } catch (e) {
    console.log("ERROR", e);
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

    const slices = Math.ceil(photos.length / 8);
    let sliceSize = photos.length / slices; // 5
    for (let i = 0; i < slices; i++) {
      let begin = i * sliceSize;
      let slice = photos.slice(begin, begin + sliceSize);
      // ---
      await new Promise((resolve) => setTimeout(resolve, 320));
      let newImgs = slice.map(async (p) => {
        try {
          const [folder, originalName] = p?.publicId.split("/");
          console.log(originalName);
          let index = `${p.index}`;
          let newIndex = "";

          if (p.index === 0) return;
          else if (index?.length === 1) newIndex = `00${index}_`;
          else if (index?.length === 2) newIndex = `0${index}_`;
          else if (index?.length === 3) newIndex = `${index}_`;

          const oldIndex = originalName.slice(0, 4);
          //console.log(oldIndex, "||", newIndex);

          if (oldIndex !== newIndex) {
            let indexedName = originalName.replace(oldIndex, newIndex);
            console.log("indexedName", indexedName);
            const newImg = await cloudinary.v2.uploader.rename(
              p?.publicId,
              `${folder}/${indexedName}`,
              {}
            );
            const dbPhoto = await Photo.findByPk(p.id);
            const dbUpdate = await dbPhoto.update({
              publicId: newImg.public_id,
            });

            return {
              IMG_CLOUDINARY: newImg,
              IMG_DB: dbUpdate,
            };
          }
        } catch (e) {
          console.log(e);
          const [folder, originalName] = p?.publicId.split("/");
          let index = `${p.index}`;
          let newIndex = "";
          if (p.index === 0) return;
          else if (index?.length === 1) newIndex = `00${index}_`;
          else if (index?.length === 2) newIndex = `0${index}_`;
          else if (index?.length === 3) newIndex = `${index}_`;

          const oldIndex = originalName.slice(0, 4);

          console.log("ERR: " + originalName);
          console.log("viejo: ", oldIndex);
          console.log("nuevo: " + newIndex);
        }
      });
    }
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
