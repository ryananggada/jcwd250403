'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.hasMany(models.Room, { foreignKey: 'propertyId', as: 'rooms' });
      Property.hasMany(models.Review, { foreignKey: 'propertyId' });
      Property.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
      Property.belongsTo(models.Tenant, {
        foreignKey: 'tenantId',
        as: 'tenant',
      });
    }
  }
  Property.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      tenantId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Property',
    }
  );
  return Property;
};
