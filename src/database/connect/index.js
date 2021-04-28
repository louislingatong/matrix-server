const mongoose = require('mongoose');
const seeder = require('../seeder');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB!');
    await seeder.exec();
  } catch (err) {

  }
}

module.exports = dbConnect;