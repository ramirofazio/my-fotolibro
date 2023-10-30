const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'photo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      URL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
