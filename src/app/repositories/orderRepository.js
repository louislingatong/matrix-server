const Order = require('../models/Order');

const createOrder = async (data, session) => {
  try {
    const order = new Order(data);
    await order.save({session});
    return order;
  } catch (e) {
    throw e;
  }
};

const retrieveOrders = async (filter, session) => {
  try {
    const orders = await Order
      .find(filter)
      .select('shopperCode orderNumber totalAmount status')
      .populate({
        path: 'deliveryAddress paymentMethod items payment',
        select: 'firstName lastName address province city postalCode barangay country email phoneNumber name quantity refModel amount ctrlRefNumber',
        populate: {
          path: 'item receipt',
          select: 'name memberPrice filename path',
          populate: {
            path: 'owner product',
            select: 'name price'
          }
        },
      })
      .session(session);
    return orders;
  } catch (e) {
    throw e;
  }
};

const retrieveOrder = async (filter, session) => {
  try {
    const order = await Order
      .findOne(filter)
      .select('shopperCode orderNumber totalAmount status')
      .session(session);
    return order;
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateOrder = async (filter, data, session) => {
  try {
    const order = await Order
      .findOneAndUpdate(
        filter,
        data,
        {new: true, session}
      )
      .select('shopperCode orderNumber totalAmount status');
    return order;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createOrder,
  retrieveOrders,
  retrieveOrder,
  retrieveUpdateOrder
};