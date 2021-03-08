const usersSeeder = require('./usersSeeder');

const exec = async () => {
  await usersSeeder();
};

module.exports = { exec };