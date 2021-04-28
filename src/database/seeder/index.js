const usersSeeder = require('./usersSeeder');
const productsSeeder = require('./productsSeeder');
const paymentMethodsSeeder = require('./paymentMethodsSeeder');

const exec = async () => {
  await usersSeeder();
  if (process.env.NODE_ENV === 'development') {
    await productsSeeder();
    await paymentMethodsSeeder();
  }
};

module.exports = {exec};