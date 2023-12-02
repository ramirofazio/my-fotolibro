const { DateTime } = require("luxon");

const d = DateTime.now().setLocale("es").toFormat("dd/MM/yyyy");

console.log(d)