const { Router } = require('express')
const router = Router()
const { Session } = require('../db.js')
const { Op } = require('sequelize')

router.post('/', async function (req, res) {
  const { clientId, deviceId } = req.body
  try {
    let exist = await Session.findOne({
      where: {
        id: {
          [Op.not]: deviceId || 0,
        },
        clientId,
        active: true,
      },
    })

    if (exist)
      return res.status(409).json({
        msg: 'Una persona esta utilizando el link',
      })

    const [session, created] = await Session.findOrCreate({
      where: {
        id: deviceId,
      },
      defaults: deviceId
        ? {
            id: deviceId,
            clientId,
          }
        : {
            clientId,
          },
    })

    if (!session.active) {
      session.active = true
      await session.save()
    }

    return res.send({ session, created })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
})
router.post('/off', async function (req, res) {
  const { deviceId } = req.body
  try {
    const updated = await Session.update(
      { active: false },
      {
        where: {
          id: deviceId,
        },
      }
    )

    if (updated[0]) return res.send('Disconnected')
    return res.status(404).send({
      msg: 'No encontrado',
    })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
router.post('/force', async function (req, res) {
  const { clientId, deviceId } = req.body
  try {
    await Session.destroy({
      where: {
        clientId,
        active: true,
        id: {
          [Op.not]: deviceId || 0,
        },
      },
    })

    const [session, created] = await Session.findOrCreate({
      where: {
        id: deviceId,
      },
      defaults: deviceId
        ? {
            id: deviceId,
            clientId,
          }
        : {
            clientId,
          },
    })

    if (!session.active) {
      session.active = true
      await session.save()
    }

    return res.send({ session, created })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
module.exports = router
