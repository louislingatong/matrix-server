const imageRepository = require('../repositories/imageRepository');

const createImage = async (data, session) => {
  try {
    return await imageRepository.createImage(data, session);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createImage
}