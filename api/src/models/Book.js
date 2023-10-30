const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'book',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      publishDate: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
