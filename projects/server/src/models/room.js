'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property',
      });
      Room.hasMany(models.Order, { foreignKey: 'roomId' });
      Room.hasMany(models.AvailableDate, {
        foreignKey: 'roomId',
        as: 'availableDates',
      });
    }
  }
  Room.init(
    {
      propertyId: DataTypes.INTEGER,
      roomType: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Room',
    }
  );
  return Room;
};
