const fs = require('fs');

const productRepository = require('../repositories/productRepository');

const imageService = require('./imageService');

const createProduct = async (data, session) => {
  try {
    return await productRepository.createProduct(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveProducts = async () => {
  try {
    return await productRepository.retrieveProducts();
  } catch (e) {
    throw e;
  }
};

const retrieveProduct = async (filter, session) => {
  try {
    return await productRepository.retrieveProduct(filter, session);
  } catch (e) {
    throw e;
  }
};

const retrieveProductById = async (_id, session) => {
  try {
    return await productRepository.retrieveProduct({_id}, session);
  } catch (e) {
    throw e;
  }
};

const updateProductById = async (_id, data, session) => {
  try {
    return await productRepository.updateProduct({_id}, data, session);
  } catch (e) {
    throw e;
  }
};

const deleteProductById = async (_id, session) => {
  try {
    return await productRepository.deleteProduct({_id}, session);
  } catch (e) {
    throw e;
  }
};

const updateProductImageById = async (_id, file, session) => {
  try {
    const {filename, fieldname} = file;
    const image = await imageService.createImage({
      filename,
      path: `${fieldname}\\${filename}`
    }, session);

    const product = await productRepository.retrieveProduct({_id}, session)

    const img = product['image'];
    if (img) {
      await fs.unlinkSync(`storage\\${image.path}`);
      await image.remove();
    }

    return image;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  retrieveProducts,
  retrieveProduct,
  retrieveProductById,
  updateProductById,
  deleteProductById,
  updateProductImageById
}