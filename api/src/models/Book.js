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
        allowNull: true,
      },
      clientId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishDate: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalSize: {
        type: DataTypes.DECIMAL,
        defaultValue: 5
      },
      totalItems: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      timestamps: false,
    }
  );
};
