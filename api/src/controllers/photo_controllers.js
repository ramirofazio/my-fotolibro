const { Photo, Album, Client } = require("../db");
const { cloudinary, sendConfirmationMail, consts } = require("../utils");

module.exports = {
  createPhoto: async function (req, res) {
    const { clientId } = req.params;
    const { photos } = req.body;
    try {
      if (!photos || !clientId)
        return res.status(401).send({
          msg: 'Faltan parametros "photos" o "clientId"',
        });

      const _photos = await Photo.bulkCreate(photos);

      res.send({ photos: _photos });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  getPhotos: async function (req, res) {
    const { clientId } = req.params;
    try {
      const photos = await Photo.findAll({
        order: [
          ["index", "DESC"],
          ["createdAt", "DESC"],
        ],
        where: {
          clientId,
        },
      });

      return res.json({
        photos: photos,
      });
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  deletePhoto: async function (req, res) {
    const { id } = req.params;
    try {
      const photo = await Photo.findByPk(id);
      const album = await Album.findByPk(photo?.albumId);
      const { deleted } = await cloudinary.deleteFile({
        public_id: photo.publicId,
      });
      if (deleted) {
        const { size } = photo;
        album.size -= parseInt(size);
        album.available += parseInt(size);
        await album.save();
        await photo.destroy();
      }

      res
        .status(200)
        .send(`Imagen ...${photo?.originalName?.slice(-12)} Eliminada`);
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  sendPhotos: async function (req, res) {
    const { clientId } = req.params;
    try {
      const client = await Client.findByPk(clientId);
      client.active_link = false;
      

      const photos = await Photo.findAll({ where: { clientId } });
      await addCloudIndex({ photos });

      client.can_download = true
      await client.save();
      /*
      const albums = await Album.findAll({
        where: { clientId },
        include: Photo,
      });

      await cloudinary.renameFile({
        public_id: "1/albm-12/000_72aee5df68edb6fbde7c253e4785af26",
        albumId: 10,
        index: 2,
      });

      if (albums.length !== 1)
        await reduceAlbums({ albums });

         const mail_response = await sendConfirmationMail({
        name: client.name,
        id: clientId,
        photos_length: 12,
      }); */

      res.send("ok");
    } catch (error) {
      console.log(error);
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  updateIndexPhotos: async function (req, res) {
    const { photos } = req.body;
    try {
      const promisesUpdate = photos.map(({ id }, i) =>
        Photo.update({ index: i + 1 }, { where: { id } })
      );

      const responses = await Promise.all(promisesUpdate);
      return res.send("ok");
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
};

async function addCloudIndex({ photos, errors = [] }) {
  if (!photos.length) return errors;
  const photo = photos.shift();
  const { publicId, index, albumId } = photo;

  try {
    const data = await cloudinary.renameFile({
      public_id: publicId,
      index,
      albumId,
    });

    if (data !== "same values") {
      photo.publicId = data.public_id;
      photo.URL = data.secure_url;
      await photo.save();
    }
  } catch (err) {
    if (err.status === 420) console.log(err);
    errors.push({
      error: err,
      photo,
    });
  }

  return addCloudIndex({ photos, errors });
}

async function reduceAlbums({ albums }) {
  if (!albums.length || albums.length === 1) return true;

  let album_from = albums.pop();
  let album_to = albums.shift();
  let photos = [];

  if (album_to.available > album_from.available) {
    const album_aux = album_from;
    album_from = album_to;
    album_to = album_aux;
  }
  photos = album_from.photos;

  while (album_to.available > consts.MIN_SIZE_AVAILABLE && photos.length) {
    const photo = photos.shift();

    album_from.available += parseInt(photo.size);
    album_from.size -= parseInt(photo.size);

    album_to.available -= parseInt(photo.size);
    album_to.size += parseInt(photo.size);

    photo.albumId = album_to.id;
    await photo.save();
  }

  if (album_to.available > consts.MIN_SIZE_AVAILABLE) albums.unshift(album_to);
  if (album_from.length) {
    album_from.photos = photos;
    albums.push(album_from);
  } else {
    await album_from.save();
    await album_from.destroy();
  }

  await album_to.save();
  return await reduceAlbums({ albums });
}
