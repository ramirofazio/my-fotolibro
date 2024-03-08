const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "album",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      size: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      available: {
        type: DataTypes.INTEGER,
        defaultValue: 100000000
      },
    },
    {
      timestamps: true,
    }
  );
};
