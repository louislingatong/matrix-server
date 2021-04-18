const Product = require('../../app/models/Product');

const createProduct = async (data) => {
  const product = new Product(data);
  await product.save();
  return product;
};

const defaultProducts = [
  {
    name: 'Quantum Alkaline Water Flask',
    price: 5000,
    memberPrice: 4000,
  },
  {
    name: 'Quantum Pendant',
    price: 2680,
    memberPrice: 2000,
  },
  {
    name: 'Quantum Shield',
    price: 380,
    memberPrice: 300,
  }
];

const seedProducts = async () => {
  try {
    const newProducts = [];
    for (const product of defaultProducts) {
      const productExists = await Product.exists({name: product.name});
      if (!productExists) {
        const newProduct = await createProduct(product);
        newProducts.push(newProduct);
      }
    }
    newProducts.length && console.log(`Seeded ${newProducts.length} new products`);
  } catch (e) {
    console.log('Error!', e.message);
  }
}

module.exports = seedProducts