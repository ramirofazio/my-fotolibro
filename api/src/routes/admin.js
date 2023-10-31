const { Router } = require("express");
const router = Router();
const { Admin } = require("../db.js");

router.post('/create', async (req, res) => {
  try {
    const admin = await Admin.create({...req.body})
    res.json({
      res: "se creo el admin con exito",
      admin,
    });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
})



module.exports = router