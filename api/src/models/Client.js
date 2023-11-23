const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'client',
    { 
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dni: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      event: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
