const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'admin',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cloud_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      api_secret: {
        type: DataTypes.STRING,
        allowNull: true
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      timestamps: false,
    }
  );
};
