const usersSeeder = require('./usersSeeder');
const productsSeeder = require('./productsSeeder');
const paymentMethodsSeeder = require('./paymentMethodsSeeder');

const exec = async () => {
  await usersSeeder();
  await productsSeeder();
  await paymentMethodsSeeder();
};

module.exports = {exec};