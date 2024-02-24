const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'photo',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      URL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      publicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cloudinaryIndex: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '000-',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  )
}
