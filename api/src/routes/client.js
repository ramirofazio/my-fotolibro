const { Router } = require("express");
const router = Router();
const { Client } = require("../db.js");


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
    res.json(client);
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.post("/", async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.json({
      esa: "usuario creado con exito",
      newClient,
    });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Client.delete({
      where: {
        id,
      },
    });
    res.json({
      esa: `cliente ${id} eliminado`,
      deleted,
    });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
});

module.exports = router;
