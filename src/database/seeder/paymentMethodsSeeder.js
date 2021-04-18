const PaymentMethod = require('../../app/models/PaymentMethod');

const createPaymentMethod = async (data) => {
  const product = new PaymentMethod(data);
  await product.save();
  return product;
};

const defaultPaymentMethods = [
  {
    name: 'GCash',
    receiverName: 'Louis Lingatong',
    receiverPhoneNumber: '09950356815',
    receiverAddress: 'Cebu City, Philippines',
  },
  {
    name: 'Cebuana Lhuillier',
    receiverName: 'Louis Lingatong',
    receiverPhoneNumber: '09950356815',
    receiverAddress: 'Cebu City, Philippines',
  },
  {
    name: 'M Lhuillier',
    receiverName: 'Louis Lingatong',
    receiverPhoneNumber: '09950356815',
    receiverAddress: 'Cebu City, Philippines',
  },
];

const seedPaymentMethods = async () => {
  try {
    const newPaymentMethods = [];
    for (const paymentMethod of defaultPaymentMethods) {
      const paymentMethodExists = await PaymentMethod.exists({name: paymentMethod.name});
      if (!paymentMethodExists) {
        const newPaymentMethod = await createPaymentMethod(paymentMethod);
        newPaymentMethods.push(newPaymentMethod);
      }
    }
    newPaymentMethods.length && console.log(`Seeded ${newPaymentMethods.length} new payment methods`);
  } catch (e) {
    console.log('Error!', e.message);
  }
}

module.exports = seedPaymentMethods