'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpecialDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpecialDate.belongsTo(models.Room, { foreignKey: 'roomId' });
    }
  }
  SpecialDate.init(
    {
      roomId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      pricePercentage: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'SpecialDate',
    }
  );
  return SpecialDate;
};
