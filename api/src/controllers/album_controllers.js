const { Op } = require("sequelize");
const { Album, Photo } = require("../db");
const { consts } = require("../utils");

async function reduceAlbums({ albums }) {
  let moved = {};
  if (!albums.length) return moved;
  let _from = albums.pop();
  let _to = albums.shift();
  let photos = [];

  if (_to.available > _from.available) {
    const aux = _from;
    _from = _to;
    _to = aux;
    photos = _from.photos;
  }

  moved[_to.id] = [];
  while (_to.available > consts.MIN_SIZE_AVAILABLE && photos.length) {
    const photo = photos.shift();
    _to.available += photo.size;
    _to.size -= photo.size;

    moved[_to.id] = photo.id;
  }

}

async function movePhotosbetweenAlbums({ PhotoIds, albumId }) {
  try {
    await Photo.update(
      { albumId },
      {
        where: {
          [Op.in]: PhotoIds,
        },
      }
    );

    return "ok";
  } catch (error) {
    throw error.message;
  }
}

module.exports = {
  getAlbums: async function (req, res) {
    const { clientId } = req.params;
    try {
      const albums = await Album.findAll({
        where: {
          clientId,
          available: {
            [Op.gte]: consts.MIN_SIZE_AVAILABLE,
          },
        },
      });

      res.status(202).send(albums);
    } catch (error) {
      res.status(404).send({
        msg: error.message,
      });
    }
  },
  //
  createAlbum: async function (req, res) {
    const { clientId } = req.params;
    try {
      const [albums, created] = await Album.findOrCreate({
        where: {
          clientId,
          available: {
            [Op.gte]: consts.MIN_SIZE_AVAILABLE,
          },
        },
        defaults: {
          clientId,
          available: consts.MAX_SIZE_AVAILABLE,
        },
      });

      if (created) {
        albums.name = "albm-" + albums.id;
        await albums.save();
      }

      res.status(202).send([albums]);
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
  //
  updateAlbum: async function (req, res) {
    const { id } = req.params;
    const { size, available } = req.body;
    try {
      const album = await Album.findByPk(id);

      album.size = size;
      album.available = available;

      await album.save();

      res.send(album);
    } catch (error) {
      res.status(500).send({
        msg: error.message,
      });
    }
  },
};
