'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Property, {
        foreignKey: 'propertyId',
        as: 'property',
      });
      Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Review.init(
    {
      propertyId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      isDone: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};
