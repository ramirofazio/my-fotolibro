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
      original_URL: {
        type: DataTypes.STRING,
      },
      URL: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('original_URL', value)
          this.setDataValue('URL', lowImageCloud(value))
        },
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

function lowImageCloud(img) {
  return img.split('upload/').join('upload/q_10/')
}
