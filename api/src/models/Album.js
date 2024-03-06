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
        defaultValue: "unknown",
      },
      size: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      available: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1e8,
      },
    },
    {
      timestamps: true,
    }
  );
};
