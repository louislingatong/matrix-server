const Image = require('../models/Image');

const createImage = async (data, session) => {
  try {
    const image = new Image(data);
    await image.save({session});
    return image;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createImage
};