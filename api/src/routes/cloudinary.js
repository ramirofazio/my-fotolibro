require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary");
const router = Router();
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
  process.env;
const { Client, Photo, Album } = require("../db.js");

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
    const albums = await Album.findAll({
      where: {
        clientId,
      },
    });
    const download_urls = await Promise.all(
      albums.map(async (albm, i) => {
        const download_url = await cloudinary.v2.utils.download_folder(
          `${clientId}/${albm.name}`,
          {
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            cloud_name: CLOUDINARY_CLOUD_NAME,
            prefixes: "/",
            target_public_id: `${zipName}_album_${i + 1}`,
          }
        );
        console.log(download_url);
        return download_url;
      })
    );
    return res.json({
      download_urls,
    });

    // console.log(downloadLinks);
    // const download_url = await cloudinary.v2.utils.download_folder(clientId, {
    //   api_key: CLOUDINARY_API_KEY,
    //   api_secret: CLOUDINARY_API_SECRET,
    //   cloud_name: CLOUDINARY_CLOUD_NAME,
    //   prefixes: "/",
    //   target_public_id: zipName,
    // });
    // console.log(download_url);
  } catch (err) {
    console.log(err);
    return res.json({
      err,
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
  } catch (err) {
    console.log(err);
    return res.json({
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
    const folder = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: clientId,
      max_results: 400,
    });

    if (folder.resources.length) {
      const public_ids = folder.resources.map((asset) => asset.public_id);

      const subArrNum = Math.ceil(public_ids.length / 100);

      let deleted_assets = [];
      for (let i = 0; i < subArrNum; i++) {
        try {
          let begin = i * 100;
          let slice = public_ids.slice(begin, begin + 100);
          const res = await cloudinary.v2.api.delete_resources(slice, {
            all: true,
          });
          deleted_assets.push(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      const deleted_folder = await cloudinary.v2.api.delete_folder(clientId);
      res.status(201).json({
        deleted_assets,
        deleted_folder,
      });
    } else {
      res.status(204).json({
        res: `the folder ${clientId} dosen't exist`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "cannot delete folder",
      err: err,
    });
  }
});

router.post("/delete/single_img", async (req, res) => {
  try {
    const { publicId, id } = req.body;

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
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "cannot delete folder",
      err: err,
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
        } catch (err) {
          console.log(err);
        }
      });
      totalSlices.push(newImgs);
    }
    return res.json({
      photos: totalSlices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
    });
  }
});

router.post("/add_cloud_imgs_index/:clientId", async (req, res) => {
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

    async function changeIndex(photos) {
      const failUpload = [];

      const slices = Math.ceil(photos.length / 15);
      let sliceSize = photos.length / slices; // 5

      for (let i = 0; i < slices; i++) {
        let begin = i * sliceSize;
        let slice = photos.slice(begin, begin + sliceSize);
        // ---
        await new Promise((resolve) => setTimeout(resolve, 400));
        slice.map(async (p) => {
          try {
            const [folder, album, originalName] = p?.publicId.split("/");

            let index = `${p.index}`;
            let newIndex = "";

            if (p.index === 0) return;
            else if (index?.length === 1) newIndex = `00${index}_`;
            else if (index?.length === 2) newIndex = `0${index}_`;
            else if (index?.length === 3) newIndex = `${index}_`;

            const oldIndex = originalName.slice(0, 4);

            if (oldIndex !== newIndex) {
              let indexedName = originalName.replace(oldIndex, newIndex);

              const newImg = await cloudinary.v2.uploader.rename(
                p?.publicId,
                `${folder}/${album}/${indexedName}`,
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
          } catch (err) {
            if (err?.http_code === 420) {
              // ? 420 es la respuesta de "to many concurrent api request"
              failUpload.push(p);
            }
            console.log(err);
          }
        });
      }

      if (failUpload?.length) {
        console.log("errs", failUpload);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return await changeIndex(failUpload);
      }
    }
    let large = photos.length;
    if (large > 150) {
      // encontrar una forma de no generar tantas solicitudes concurrentes
      const part1 = photos.slice(0, large / 2);
      const part2 = photos.slice(large / 2, large);
      await changeIndex(part1);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await changeIndex(part2);
    }

    console.log("se han cambiado");
    return res.json({
      photos,
    });
  } catch (err) {
    console.log(err);
    const { clientId } = req.body;
    return res.status(401).json({
      e,
      clientId,
    });
  }
});

module.exports = router;
