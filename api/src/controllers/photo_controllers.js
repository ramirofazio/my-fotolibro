const { Photo, Album } = require("../db");
const { cloudinary } = require("../utils");

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
};
