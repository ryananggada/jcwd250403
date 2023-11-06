'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.belongsTo(models.Room, { foreignKey: 'roomId' });
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      totalPrice: DataTypes.INTEGER,
      paymentProof: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
