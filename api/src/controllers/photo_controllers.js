const { where } = require("sequelize");
const { Photo, Album, Client } = require("../db");
const { cloudinary, sendConfirmationMail, consts } = require("../utils");
const _cloudinary = require("cloudinary");
const { SELECT } = require("sequelize/lib/query-types");
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
  process.env;

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
    console.log("* START *");
    try {
      await Client.update(
        { active_link: false },
        {
          where: {
            id: clientId,
          },
        }
      );
      await Client.update(
        { can_download: false },
        {
          where: {
            id: clientId,
          },
        }
      );

      const photos = await Photo.findAll({ where: { clientId } });
      await addCloudIndex({ photos });

      await Client.update(
        { can_download: true },
        {
          where: {
            id: clientId,
          },
        }
      );

      console.log("* END *");
      console.log("* DELETING 000_ IMGS *");
      // ---- delete zeros
      const deleteZeroIndex = async (clientId) => {
        try {
          // const { clientId } = req.body;

          const albums = await Album.findAll({
            where: {
              clientId,
            },
          });

          _cloudinary.v2.config({
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            cloud_name: CLOUDINARY_CLOUD_NAME,
          });

          async function getResources() {
            const albumsAssets = [];
            for (let i = 0; i < albums.length; i++) {
              const album = albums[i];
              const folder = await _cloudinary.v2.api.resources({
                type: "upload",
                prefix: `${clientId}/${album.name}`,
                max_results: 400,
              });
              albumsAssets.push(folder?.resources);
            }
            return albumsAssets;
          }

          const resources = await getResources();
          const flatted = resources.flat();
          const delete_assets = flatted.filter((img) => {
            const [clientId, album, publicId] = img.public_id.split("/");
            const lastIndex = publicId.slice(3, 4); // ? Si  el resultado de index es "_" significa que la foto no se ha guardado en la db
            return lastIndex === "_";
          });
          if (!delete_assets.length) return "No hay imagenes inecesarias";
          const publicIds = delete_assets.map((img) => img.public_id);

          const deleted = await _cloudinary.v2.api.delete_resources(publicIds, {
            all: true,
          });

          return deleted;
        } catch (err) {
          return { err };
        }
      };
      const deleted = await deleteZeroIndex(clientId);
      res.send("ok");
    } catch (err) {
      console.log(err);
      res.status(500).send({
        msg: err.message,
      });

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
    }
  },
  deleteZeroIndex: async function (clientId) {
    try {
      // const { clientId } = req.body;

      const albums = await Album.findAll({
        where: {
          clientId,
        },
      });

      _cloudinary.v2.config({
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        cloud_name: CLOUDINARY_CLOUD_NAME,
      });

      async function getResources() {
        const albumsAssets = [];
        for (let i = 0; i < albums.length; i++) {
          const album = albums[i];
          const folder = await _cloudinary.v2.api.resources({
            type: "upload",
            prefix: `${clientId}/${album.name}`,
            max_results: 400,
          });
          albumsAssets.push(folder?.resources);
        }
        return albumsAssets;
      }

      const resources = await getResources();
      const flatted = resources.flat();
      const delete_assets = flatted.filter((img) => {
        const [clientId, album, publicId] = img.public_id.split("/");
        const lastIndex = publicId.slice(3, 4); // ? Si  el resultado de index es "_" significa que la foto no se ha guardado en la db
        console.log(clientId, album, "++", lastIndex);
        return lastIndex === "_";
      });
      if (!delete_assets.length) return "No hay imagenes inecesarias";
      const publicIds = delete_assets.map((img) => img.public_id);

      const deleted = await _cloudinary.v2.api.delete_resources(publicIds, {
        all: true,
      });

      return deleted;
    } catch (err) {
      return { err };
    }
  },

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
  if (!photos.length) {
    console.log("Se ordeno la ultima photo");
    return errors;
  }
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
