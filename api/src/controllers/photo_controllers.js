const { Photo, Album, Client } = require("../db");
const { cloudinary, sendConfirmationMail } = require("../utils");

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
      client.save();

      /* const mail_response = await sendConfirmationMail({
        name: client.name,
        id: clientId,
        photos_length: 12,
      }); */
      res.send("mail_response");
    } catch (error) {
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
