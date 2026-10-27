import initialProducts from './products.json';

export const products = initialProducts || [];

export const standardProducts = products.filter((product) => product.type === 'product');
export const comboProducts = products.filter((product) => product.type === 'combo');
export const featuredProducts = products.filter((product) => product.featured);
export const findProduct = (id) => products.find((product) => product.id === id);
