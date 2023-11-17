const { Router } = require("express");
const router = Router();
const { Admin } = require("../db.js");
const transporter = require("../node_mailer")

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

router.get("/email", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Sos re logii 👻" <tomixdperez@gmail.com>', // sender address
      to: "tomi2001perez@gmail.com, baz@example.com", // list of receivers
      subject: "para ver si funca", // Subject line
      text: "Hello world?", // plain text body
      html: `
      <b>Imagenes cargadas con exito</b>
      <h1>Ah re locoo</h1>
      `, // html body
    });
    console.log(info)
    
  } catch (err) {
    console.log(err)
    res.json({
      messagge: "no salio",
      err
    })
  }

})

module.exports = router