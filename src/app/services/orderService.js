const _ = require('lodash');
const randomstring = require('randomstring');
const {app} = require('../../../config');

const orderRepository = require('../repositories/orderRepository');
const orderItemRepository = require('../repositories/orderItemRepository');
const deliveryAddressService = require('./deliveryAddressService');
const paymentMethodService = require('./paymentMethodService');
const productService = require('./productService');
const sellerProductService = require('./sellerProductService');
const userService = require('./userService');
const walletService = require('./walletService');
const imageService = require('./imageService');
const paymentService = require('./paymentService');
const emailVerifyTicketService = require('./emailVerifyTicketService');
const Error = require('../helpers/errorHelper');

const newOrderEventEmitter = require('../events/newOrderEvent');

const generateOrderNumber = async (session) => {
  let orderNumber;
  let isUniqueOrderNumber =  true;

  while (isUniqueOrderNumber) {
    orderNumber = await randomstring.generate(6);
    isUniqueOrderNumber = await userService.checkUserExist({orderNumber}, session);
  }

  return orderNumber;
};

const calculateLevel1Share = (amount, percentage) => {
  let share = 0;
  share += (amount * (percentage / 100));
  return share;
};

const completedOrder = async (order, session) => {
  let user;

  if (order['shopperCode']) {
    user = await userService.retrieveUser({code: order['shopperCode']}, session);
  }

  for (const item of order.items) {
    if (user) {
      const sellerProduct = await sellerProductService.retrieveSellerProduct({
        owner: user,
        product: item.item
      }, session);

      if (sellerProduct) {
        await sellerProduct.updateOne({$inc: {quantity: item.quantity}}).session(session);
      } else {
        await sellerProductService.createSellerProduct({
          owner: user,
          product: item.item,
          quantity: item.quantity
        }, session);
      }
    } else {
      const sellerProduct = await sellerProductService.retrieveSellerProduct({_id: item.item}, session);
      const level1User = await userService.retrieveUser({code: sellerProduct['owner']['group']}, session);

      const purchasedAmount = item.quantity * sellerProduct['product']['price'];
      const walletTransaction = await walletService.createWalletTransaction({
        type: 'CASH_IN',
        amount: purchasedAmount,
        message: 'payment'
      }, session);
      await walletService.retrieveUpdateWallet(
        {owner: sellerProduct['owner']},
        {
          $inc: {balance: purchasedAmount},
          $push: {transactions: walletTransaction}
        },
        session
      );

      switch (sellerProduct['owner']['level']) {
        case 2:
          if (sellerProduct['owner']['members'].length === app.maxMembers) {
            const shares = calculateLevel1Share(order['totalAmount'], app.level2To1Percentage)
            const walletTransaction = await walletService.createWalletTransaction({
              type: 'CASH_IN',
              amount: shares,
              message: `shares from level ${sellerProduct['owner']['level']} user`
            }, session);
            await walletService.retrieveUpdateWallet(
              {owner: level1User},
              {
                $inc: {balance: shares},
                $push: {transactions: walletTransaction}
              },
              session
            );
          }
          break;
        case 3:
          if (sellerProduct['owner']['members'].length === app.maxMembers) {
            const shares = calculateLevel1Share(order['totalAmount'], app.level3To1Percentage)
            const walletTransaction = await walletService.createWalletTransaction({
              type: 'CASH_IN',
              amount: shares,
              message: `shares from level ${sellerProduct['owner']['level']} user`
            }, session);
            await walletService.retrieveUpdateWallet(
              {owner: level1User},
              {
                $inc: {balance: shares},
                $push: {transactions: walletTransaction}
              },
              session
            );
          }
          break;
        case 4:
          const shares = calculateLevel1Share(order['totalAmount'], app.level4To1Percentage);
          const walletTransaction = await walletService.createWalletTransaction({
            type: 'CASH_IN',
            amount: shares,
            message: `shares from level ${sellerProduct['owner']['level']} user`
          }, session);
          await walletService.retrieveUpdateWallet(
            {owner: level1User},
            {
              $inc: {balance: shares},
              $push: {transactions: walletTransaction}
            },
            session
          );
          break;
      }

      await sellerProductService.retrieveUpdateSellerProduct(
        {_id: item.item},
        {$inc: {sold: item.quantity}},
        session
      );
    }
  }
};

const createOrder = async (data, session) => {
  try {
    const deliveryAddress = await deliveryAddressService.createDeliveryAddress({
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      province: data.province,
      city: data.city,
      postalCode: data.postalCode,
      barangay: data.barangay,
      country: data.country,
      email: data.email,
      phoneNumber: data.phoneNumber
    }, session);

    const paymentMethod = await paymentMethodService.retrievePaymentMethod({_id: data.paymentMethodId}, session);

    const orderNumber = await generateOrderNumber();
    let orderList = [];

    if (data.code) {
      const items = [];
      let totalAmount = 0;
      for (let i = 0; i < data.items.length; i++) {
        const item = await productService.retrieveProduct({_id: data.items[i]['itemId']}, session);
        if (!item) {
          Error.unprocessableEntity({[`items[${i}].itemId`]: `Items[${i}].itemId with value ${data.items[i]['itemId']} is invalid.`});
        }
        totalAmount += item['memberPrice'] * data.items[i]['quantity'];
        const orderItem = await createOrderItem({
          item,
          quantity: data.items[i]['quantity'],
          refModel: data.items[i]['refModel']
        }, session)
        items.push(orderItem);
      }
      const order = await orderRepository.createOrder({
        shopperCode: data.code,
        orderNumber,
        deliveryAddress,
        paymentMethod,
        items,
        totalAmount,
      }, session);

      orderList.push(order);
    } else {
      let groupedItems = _.chain(data.items).groupBy((i) => i.owner).toPairs().value();
      for (let i = 0; i < groupedItems.length; i++) {
        const items = [];
        let totalAmount = 0;
        const [key, value] = groupedItems[i];
        for (let i = 0; i < value.length; i++) {
          const item = await sellerProductService.retrieveSellerProduct({_id: value[i]['itemId']}, session);
          if (!item) {
            Error.unprocessableEntity({[`items[${i}].itemId`]: `Items[${i}].itemId with value ${value[i]['itemId']} is invalid.`});
          }
          totalAmount += item['product']['price'] * value[i]['quantity'];
          const orderItem = await createOrderItem({
            item,
            quantity: data.items[i]['quantity'],
            refModel: data.items[i]['refModel']
          }, session)
          items.push(orderItem);
        }
        const order = await orderRepository.createOrder({
          shopperCode: data.code,
          orderNumber,
          deliveryAddress,
          paymentMethod,
          items,
          totalAmount,
        }, session);

        orderList.push(order);
      }
    }

    const totalPayableAmount = _.sumBy(orderList, (o) => o.totalAmount);

    newOrderEventEmitter.emit('sendPayOrderLink', `${deliveryAddress['firstName']} ${deliveryAddress['lastName']}`, deliveryAddress['email'], orderNumber, totalPayableAmount, paymentMethod);

    return {orderNumber, orderList};
  } catch (e) {
    throw e;
  }
};

const createOrderItem = async (data, session) => {
  try {
    return await orderItemRepository.createOrderItem(data, session);
  } catch (e) {
    throw e;
  }
};

const createOrderPaymentByOrderNumber = async (orderNumber, data, file, session) => {
  try {
    let updatedOrders = [];
    const orders = await retrieveOrders({orderNumber}, session);

    if (_.isEmpty(orders)) {
      Error.unprocessableEntity({orderNumber: 'Order number is invalid.'});
    }

    const {filename, fieldname} = file;
    const receipt = await imageService.createImage({
      filename,
      path: `${fieldname}\\${filename}`
    }, session);

    const payment = await paymentService.createPayment({
      ...data,
      receipt
    }, session);

    for (const order of orders) {
      const updatedOrder = await orderRepository.retrieveUpdateOrder({_id: order._id}, {payment, status: 'PROCESSING'}, session)
      updatedOrders.push(updatedOrder);
    }

    return updatedOrders;
  } catch (e) {
    throw e;
  }
}

const retrieveOrders = async (filter) => {
  try {
    return await orderRepository.retrieveOrders(filter);
  } catch (e) {
    throw e;
  }
};

const retrieveOrderById = async (_id, session) => {
  try {
    return await orderRepository.retrieveOrder({_id}, session)
  } catch (e) {
    throw e;
  }
};

const retrieveOrder = async (filter, session) => {
  try {
    return await orderRepository.retrieveOrder(filter, session)
  } catch (e) {
    throw e;
  }
}

const updateOrderStatusByOrderNumber = async (orderNumber, data, session) => {
  try {
    const orders = await retrieveOrders({orderNumber}, session);

    if (_.isEmpty(orders)) {
      Error.unprocessableEntity({orderNumber: 'Order number is invalid.'});
    }

    for (const order of orders) {
      if (order.status === 'CONFIRMED' && data.status === 'COMPLETED') {
        await completedOrder(order, session);
      }

      await order.updateOne({status: data.status}).session(session);
    }

    return data.status;
  } catch (e) {
    throw e;
  }
};

const sendVerifyEmailCode = async (data, session) => {
  try {
    const emailVerifyTicket = await emailVerifyTicketService.retrieveUpdateEmailVerifyTicket(data, data, session);
    newOrderEventEmitter.emit('sendVerifyEmailCode', data.email, emailVerifyTicket['code']);
    return emailVerifyTicket;
  } catch (e) {
    throw e;
  }
};

const checkEmailStatus = async (data, session) => {
  try {
    const emailVerifyTicket = await emailVerifyTicketService.retrieveEmailVerifyTicket(data, session);
    if (emailVerifyTicket) {
      return emailVerifyTicket['isVerified'];
    }
    return false;
  } catch (e) {
    throw e;
  }
};

const verifyEmail = async (filter, session) => {
  try {
    const emailVerifyTicket = await emailVerifyTicketService.retrieveUpdateEmailVerifyTicket(filter, {isVerified: true}, session);
    if (!emailVerifyTicket) {
      Error.unprocessableEntity({code: 'Code is invalid'});
    }

    if (Date.now() > emailVerifyTicket['expireAt']) {
      Error.unprocessableEntity({code: 'Code is already expired'});
    }

    return emailVerifyTicket['isVerified'];
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createOrder,
  createOrderItem,
  createOrderPaymentByOrderNumber,
  retrieveOrders,
  retrieveOrderById,
  retrieveOrder,
  updateOrderStatusByOrderNumber,
  sendVerifyEmailCode,
  checkEmailStatus,
  verifyEmail,
}