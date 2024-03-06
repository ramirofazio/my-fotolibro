const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('session', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      initialValue: 1000,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  })
}
