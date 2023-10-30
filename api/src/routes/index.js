const { Router } = require("express");
const router = Router();
const client = require("./client")
const cloudinary = require("./cloudinary")
const admin = require("./admin")

router.use("/client", client);
router.use("/cloudinary", cloudinary)
router.use("/admin", admin)

module.exports = router;
