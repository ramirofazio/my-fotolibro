const { Router } = require("express");
const router = Router();
const { Client, Photo } = require("../db.js");
const cloudinary = require("cloudinary");
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;

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
    console.log(id);
    const client = await Client.findOne({
      where: {
        id,
      },
    });
    if(!client) {
      return res.status(404).json({
        err: `no se encontro el cliente: ${id}`,
        res: client
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
    console.log(req.body)

    const {name, email} = req.body
    if(!name || !email) {
      return res.json({
        res: "faltan parametros para crear el cliente",
        payload: req.body
      })
    }
    // ? Se crea el usuario, y se utiliza su ID para
    // ? crear su "upload_preset" y su respectiva carpeta
    const newClient = await Client.create(req.body);
    console.log(newClient)
    
    cloudinary.v2.api.create_upload_preset({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      name: newClient.id,
      folder: newClient.id,
      unsigned: true,
      disallow_public_id: false,
      use_asset_folder_as_public_id_prefix: false
    }).then((result) => {
      return res.json({upload_preset: result, clientId: newClient.id})
    })
  } catch (e) {
    console.log(e);
    res.status(401).json({ e });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    console.log(req.params)
    console.log(req.body)
    const updated = await Client.update(
      {
        ...req.body,
      },
      { where: { id } }
    );
    res.json({
      esa: `cliente ${id} actualizado`,
      updated,
    });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.delete("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const deleted = await Client.destroy({
      where: {
        id: clientId,
      },
    });
    cloudinary.v2.config({
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_CLOUD_NAME,
    })
    const deleted_upload_preset = await cloudinary.v2.api.delete_upload_preset(clientId)
    res.json({
      message: `cliente ${id} eliminado`,
      upload_preset: deleted_upload_preset,
      deleted,
    });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.post("/imgs", async (req, res) => {
  try {
    const {imgs, clientId} = req.body
    if(!imgs || !clientId) {
      res.status(401).send("faltan parametros")
    }
    
    const client = await Client.findByPk(clientId)
    
    const rawImgs = imgs.map(i => {
      return {...i, clientId}
    })
    const bulk = await Photo.bulkCreate(rawImgs)
    res.json({
      res: " se subieron",
      imgs: bulk
    })
  }
  catch(e) {
    console.log(e)
  }
})

module.exports = router;
