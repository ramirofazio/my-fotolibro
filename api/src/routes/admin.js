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

router.post("/send_client_url", async (req, res) => {
  const {clientId, clientEmail} = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"myfotolibro 📷" <${EMAIL_USER}>`, 
      to: clientEmail, 
      subject: "subida de fotos", 
      text: "Hello world?", 
      html: `
      <b>Cargue sus fotos!</b>
      <h1>Ya esta disponilbe el link para la carga de sus fotos</h1>

      
      `, 
    });
    console.log(info)
    res.json(info)
  } catch (err) {
    console.log(err)
    res.json({
      messagge: "no salio",
      err
    })
  }
})

module.exports = router