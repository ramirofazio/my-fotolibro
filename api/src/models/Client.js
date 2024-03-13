const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'client',
    { 
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      last_link_download: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      },
      active_link: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      upload_preset: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      can_download: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      timestamps: true,
    }
  );
};
