const { check_env } = require('./src/utils')

/*
const server = require("./src/app.js");
const { conn } = require("./src/db.js");

 conn.sync({ force: false, alter: true }).then(() => {
  server.listen(3001, () => {
    console.log("%s listening at 3001");
  });
}); */

function main() {
  check_env()
}

main()

console.log('good')
