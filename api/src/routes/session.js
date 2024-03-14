const { Router } = require("express");
const router = Router();
const { Session, Client } = require("../db.js");
const { Op } = require("sequelize");

router.post("/", async function (req, res) {
  const { clientId } = req.body;
  try {
    let client = await Client.findByPk(clientId);

    if (client.online)
      return res.status(409).json({
        msg: "Una persona esta utilizando el link",
      });
    client.online = true;
    await client.save();

    return res.send({ online: client.online ? "online" : "ofline" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
});
router.post("/off", async function (req, res) {
  try {
    const { clientId } = req.body;

    let client = await Client.findByPk(clientId);

    client.online = false;
    await client.save();

    return res.send({ online: client.online ? "online" : "ofline" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
router.post("/force", async function (req, res) {
  const { clientId } = req.body;
  try {
    let client = await Client.findByPk(clientId);

    client.online = true;
    await client.save();

    return res.send({ online: client.online ? "online" : "ofline" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = router;
