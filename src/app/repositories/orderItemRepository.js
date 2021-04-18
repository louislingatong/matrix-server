const OrderItem = require('../models/OrderItem');

const createOrderItem = async (data, session) => {
  try {
    const orderItem = new OrderItem(data);
    await orderItem.save({session});
    return orderItem;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createOrderItem
};