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

router.get("/verify/:adminId", async (req, res) => {
  try {
    const {adminId} = req.params
    const isAdmin = await Admin.findByPk(adminId)
    if(!isAdmin) {
      return res.status(401).json({
        messagge: "not authorized",
        isAdmin
      })
    }
    return res.send("authorized")
  } catch (e) {
    console.log(e)
  }
})



module.exports = router