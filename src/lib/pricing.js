export function getProductPrice(product, variant) {
  if (variant) return { price: variant.salePrice, mrp: variant.mrp };
  return { price: product.salePrice, mrp: product.mrp };
}

export function getDiscountPercent(mrp, price) {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}
