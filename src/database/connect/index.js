const mongoose = require('mongoose');
const seeder = require('../seeder');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
    console.log('Connected to DB!')
    if (process.env.NODE_ENV === 'development' || 'dev') {
      await seeder.exec();
      console.log('Seeders has been executed!')
    }
  } catch (err) {

  }
}

module.exports = dbConnect;