const { Router } = require("express");
const router = Router();

router.get('/', (req, res) => {
  res.json({
    esa: "te la sabias?"
  })
})

module.exports = router