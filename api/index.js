const { check_env, env } = require('./src/utils')
const server = require('./src/app.js')
const { conn } = require('./src/db.js')

function main(force) {
  const PORT = env.PORT || 3001

  check_env()

  conn.sync({ force, alter: !force }).then(() => {
    server.listen(PORT, () => console.log('%s listening at ' + PORT))
  })
}

main(true)
