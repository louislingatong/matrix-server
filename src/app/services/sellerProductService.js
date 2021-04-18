const sellerProductRepository = require('../repositories/sellerProductRepository');

const productsPipeline = () => {
  const pipeline = [];
  pipeline.push({
    $lookup: {
      from: 'products',
      localField: 'product',
      foreignField: '_id',
      as: 'product'
    },
  });
  pipeline.push({
    $unwind: '$product'
  });
  pipeline.push({
    $group: {
      _id: '$product._id',
      name: {
        $first: '$product.name'
      }
    }
  });
  return pipeline;
};

const ownersPipeline = () => {
  const pipeline = [];
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'owner'
    }
  });
  pipeline.push({
    $unwind: '$owner'
  });
  pipeline.push({
    $group: {
      _id: '$owner._id',
      name: {
        $first: '$owner.name'
      }
    }
  });
  return pipeline;
}

const createSellerProduct = async (data, session) => {
  try {
    return await sellerProductRepository.createSellerProduct(data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveSellerProductsByParams = async (data, session) => {
  try {
    let filter = {};

    if (data.ownerId && data.productId) {
      filter = {owner: data.ownerId, product: data.productId};
    } else if (data.ownerId && !data.productId) {
      filter = {owner: data.ownerId};
    } else if (!data.ownerId && data.productId) {
      filter = {product: data.productId};
    }

    return await sellerProductRepository.retrieveSellerProducts(filter, session);
  } catch (e) {
    throw e;
  }
};

const retrieveSellerProductById = async (_id, session) => {
  try {
    return await sellerProductRepository.retrieveSellerProduct({_id}, session);
  } catch (e) {
    throw e;
  }
};

const retrieveSellerProduct = async (filter, session) => {
  try {
    return await sellerProductRepository.retrieveSellerProduct(filter, session)
  } catch (e) {
    throw e;
  }
};

const retrieveUpdateSellerProduct = async (filter, data, session) => {
  try {
    return await sellerProductRepository.retrieveUpdateSellerProduct(filter, data, session);
  } catch (e) {
    throw e;
  }
};

const retrieveUniqueProducts = async () => {
  try {
    const pipeline = productsPipeline();
    return await sellerProductRepository.aggregateSellerProducts(pipeline);
  } catch (e) {
    throw e;
  }
};

const retrieveUniqueOwners = async () => {
  try {
    const pipeline = ownersPipeline();
    return await sellerProductRepository.aggregateSellerProducts(pipeline);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createSellerProduct,
  retrieveSellerProductsByParams,
  retrieveSellerProductById,
  retrieveSellerProduct,
  retrieveUpdateSellerProduct,
  retrieveUniqueProducts,
  retrieveUniqueOwners
}