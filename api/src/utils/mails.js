const transporter = require("../node_mailer");
const { env } = require("./env");
const { Client, Photo, Album } = require("../db");
const cloudinary = require("./cloudinary");

async function loadJsonClients(_client) {
  try {
    const { name, email, photos } = _client;
    const [client, created] = await Client.findOrCreate({
      where: {
        name,
      },
      defaults: {
        name,
        email,
        created_at: new Date(),
      },
    });

    if (!created) return console.log("Creado previamente");
    console.log(client);
    const upload_preset = await cloudinary.createUpload_preset({
      folder: client.id,
      name: `${client.name.split(" ").join("-")}-${client.id}`,
    });
    
    client.upload_preset = upload_preset.name;
    await client.save();

    if (!photos?.length) return console.log("Sin photos");

    const rawPhotos = photos.map(({ URL, publicId, ...p }) => {
      const spl = URL.split("/");
      URL = URL.replace(
        spl[spl.length - 1].split(".")[0],
        publicId.split("/")[1]
      );
      return {
        clientId: client.id,
        size: parseInt(p.size),
        URL,
        publicId,
        index: "",
        ...p,
      };
    });

    getPromisesUpload({clientId:client.id, images: rawPhotos})
    
    await Photo.bulkCreate(rawPhotos);
  } catch (err) {
    console.log(err);
  }
}

async function getPromisesUpload({
  clientId,
  albums,
  images,
  promises = {},
}) {
  if (!images.length) return promises;
  if (!albums?.id) {
    albums =[ await Album.create({ clientId })];
  }

  let { size, available, id } = albums[0];

  promises[id] = [];

  while (available > AVAILABLE_SIZE && images.length) {
    const img = images.shift();
    size += img.size;
    available -= img.size;

    promises[id].push({ ...img, albumId: id });

    const newPublicId = `${clientId}/albm-${id}/${getStringWithZeros(
      img.index,
      4
    )}_${img.originalName}`;
    console.log(newPublicId);
    //await cloudinary.renameFile({public_id: img.publicId, to: newPublicId})
  }

  albums.size = size;
  albums.available = available;
  await albums.save();

  return await getPromisesUpload({
    clientId,
    albums: albums.slice(1),
    images,
    promises,
  });
}
function getStringWithZeros(num, size) {
  let numString = num.toString();
  const zeros = size - numString.length;
  return "0".repeat(zeros) + numString;
}

module.exports = {
  loadJsonClients,
  sendConfirmationMail: async function ({ name, id, photos_length }) {
    const response = await transporter.sendMail({
      from: `"myfotolibro 📷" <${env.mail.USER}>`,
      to: env.mail.ADMIN,
      subject: "Se cargó nuevo book",
      text: "Hello world?",
      html: `
        <h1>El cliente ${name}</h1>
        <h3>ID: ${id}</h3>
        <hr/>
        <h2>Termino su book con ${photos_length} fotos</h1>
        `,
    });
    return response;
  },
};
