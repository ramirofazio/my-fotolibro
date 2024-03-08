const { Photo } = require("../db");

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
};
