require("dotenv").config();
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  EMAIL_PASSWORD,
  EMAIL_USER,
  ADMIN_EMAIL,
} = process.env;
const { Router } = require("express");
const router = Router();
const { Client, Photo, Admin, Book } = require("../db.js");
const cloudinary = require("cloudinary");
const transporter = require("../node_mailer");
const { DateTime } = require("luxon");
const { Op } = require("sequelize");
const bytesToMb = require("../u_tils.js");
const {
  getAlbums,
  createAlbum,
  updateAlbum,
  createPhoto,
  getPhotos,
  deletePhoto,
} = require("../controllers");

router.get("/", async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findOne({
      where: {
        id,
      },
    });
    if (!client) {
      return res.status(404).json({
        err: `no se encontro el cliente: ${id}`,
        res: client,
      });
    }
    res.json(client);
  } catch (e) {
    console.log(e);
    res.status(404).json({ e });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({
        res: "faltan parametros para crear el cliente",
        payload: req.body,
      });
    }
    // ? Se crea el usuario, y se utiliza su ID para
    // ? crear su "upload_preset" y su respectiva carpeta

    const newClient = await Client.create({
      ...req.body,
      created_at: DateTime.now().setLocale("es").toFormat("dd/MM/yyyy"),
    });

    await Book.create({
      name,
      clientId: newClient.id,
    });

    newClient.upload_preset = `${newClient.name}-${newClient.id}`;
    await newClient.save();

    const result = await cloudinary.v2.api.create_upload_preset({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      name: `${newClient.name}-${newClient.id}`, //minimum 6 charcaters
      folder: newClient.id,
      unsigned: true,
      disallow_public_id: false,
      use_asset_folder_as_public_id_prefix: false,
    });
    return res
      .status(200)
      .json({ upload_preset: result, newClient});
  } catch (e) {
    console.log(e);
    res.status(401).json({ e });
  }
});

router.put("/edit_client/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Client.update(
      {
        ...req.body,
      },
      { where: { id } }
    );
    res.status(200).json({
      esa: `cliente ${id} actualizado`,
      updated,
    });
  } catch (e) {
    console.log(e);
    res.status(409).json({ e });
  }
});

router.delete("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    client.destroy();
    await client.save();

    await Book.destroy({
      where: { clientId: clientId },
    });

    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    });
    const deleted_upload_preset = await cloudinary.v2.api.delete_upload_preset(
      client.upload_preset
    );
    res.status(200).json({
      message: `cliente ${client.name} eliminado`,
      upload_preset: deleted_upload_preset,
      deleted: true,
    });
  } catch (err) {
    console.log(err);
    res.status(409).json({
      err,
      deleted: false,
    });
  }
});

router.get("/imgs/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const photos = await Photo.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        clientId,
      },
    });
    const sortedPhotos = photos.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    });
    return res.json({
      photos: sortedPhotos,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/imgs", async (req, res) => {
  try {
    const { imgs, clientId } = req.body;
    if (!imgs || !clientId) {
      res.status(401).send("faltan parametros");
    }
    console.log(clientId);
    let totalSize = 0;

    const rawImgs = imgs.map((i) => {
      totalSize = totalSize + i.size;
      return { ...i, clientId };
    });

    const bulk = await Photo.bulkCreate(rawImgs);
    const book = await Book.findOne({ where: { clientId } });

    const sizeSum = parseInt(book.totalSize) + parseInt(totalSize);
    const itemsSum = parseInt(book.totalItems) + parseInt(rawImgs.length);
    console.log("suma:", sizeSum);

    const newBook = await Book.update(
      { totalSize: sizeSum, totalItems: itemsSum },
      { where: { clientId: clientId } }
    );
    console.log(newBook);
    res.json({
      res: " se subieron",
      imgs: bulk,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/canFinish/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const photos = await Photo.findAll({
      where: {
        clientId,
        index: { [Op.is]: null },
      },
    });

    return res.json({
      canFinish: photos.length ? false : true,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      e,
    });
  }
});

router.post("/finish_upload", async (req, res) => {
  const { clientId, photos_length } = req.body;
  try {
    const client = await Client.findByPk(clientId);
    client.can_download = true;
    await client.save()

    const info = await transporter.sendMail({
      from: `"myfotolibro 📷" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "Se cargó nuevo book",
      text: "Hello world?",
      html: `
      <h1>El cliente ${client?.name}</h1>
      <h3>ID: ${client?.id}</h3>
      <hr/>
      <h2>Termino su book con ${photos_length} fotos</h1>
      `,
    });

    res.json(info);
  } catch (err) {
    console.log(err);
    res.json({
      messagge: "no salio",
      err,
    });
  }
});

router.get("/connect/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    const connected = await client.update({
      online: true,
    });
    return res.status(202).json(connected);
  } catch (e) {
    console.log(e);
    return res.status(401).json(e);
  }
});

router.get("/disconnect/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    const connected = await Client.update({
      // undefined
      online: false,
    });

    return res.status(202).json(connected);
  } catch (e) {
    console.log(e);
    return res.status(401).json(e);
  }
});

router.put("/index_images", async (req, res) => {
  try {
    const { imgs } = req.body;

    const indexedImgs = await imgs.forEach(async (img, i) => {
      try {
        await Photo.update({ index: i + 1 }, { where: { id: img.id } });
      } catch (e) {
        console.log(e);
      }
    });

    return res.json({
      imgs,
      indexedImgs,
    });
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      e,
    });
  }
});

router.put("/timestamp/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    const newDate = await client.update({
      last_link_download: Date.now(),
    });
    res.json(newDate);
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.put("/activeClient/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);
    const paused = await client.update({
      active_link: client.active_link === true ? false : true,
    });
    res.status(200).json(paused);
  } catch (err) {
    res.status(409).json({
      err,
    });
  }
});

router.get("/albums/:clientId", getAlbums);
router.post("/albums/:clientId", createAlbum);
router.put("/albums/:id", updateAlbum);

router.get("/photos/:clientId", getPhotos);
router.post("/photos/:clientId", createPhoto);
router.delete("/photo/:id", deletePhoto);

module.exports = router;
