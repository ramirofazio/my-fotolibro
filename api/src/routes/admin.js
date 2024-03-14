const { Router } = require("express");
const router = Router();
const { Admin } = require("../db.js");
const transporter = require("../node_mailer");
require("dotenv").config();
const { EMAIL_USER, ENV } = process.env;

router.post("/create", async (req, res) => {
  try {
    const admin = await Admin.create({ ...req.body });
    res.json({
      res: "se creo el admin con exito",
      admin,
    });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
});

router.get("/verify/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const isAdmin = await Admin.findByPk(adminId);
    if (!isAdmin) {
      return res.status(401).json({
        messagge: "not authorized",
        isAdmin,
      });
    }
    return res.send("authorized");
  } catch (err) {
    console.log(err);
    res.status(401).json({err})
  }
});

router.post("/send_client_url", async (req, res) => {
  const { clientId, clientEmail } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"myfotolibro 📷" <${EMAIL_USER}>`,
      to: clientEmail,
      subject: "subida de fotos",
      text: "Hello world?",
      html: `
      <b>Cargue sus fotos!</b>
      <h2>Ya esta disponilbe el link para la carga de sus fotos</h2>
      <br/>
      <h1> ${
        ENV === "production"
          ? `http://myfotolibro.cloud/client/${clientId}/client_data`
          : `http://localhost:5173/client/${clientId}/client_data`
      } </h1>
      `,
    });
    res.json(info);
  } catch (err) {
    console.log(err);
    res.json({
      messagge: "no salio",
      err,
    });
  }
});

module.exports = router;
