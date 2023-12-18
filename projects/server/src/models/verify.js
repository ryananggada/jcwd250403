'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Verify.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Verify.init(
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
      otp: DataTypes.STRING,
      attemptsLeft: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Verify',
    }
  );
  return Verify;
};
