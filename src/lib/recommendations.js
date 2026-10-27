const meaningfulWords = (product) => new Set(
  `${product.name} ${product.description}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3),
);

export function getRelatedProducts(product, products = [], limit = 4) {
  const words = meaningfulWords(product);

  return products
    .filter((candidate) => candidate.id !== product.id && candidate.inStock)
    .map((candidate) => {
      const sharedWords = [...meaningfulWords(candidate)].filter((word) => words.has(word)).length;
      const score = (candidate.category === product.category && product.category ? 100 : 0)
        + (candidate.type === product.type ? 25 : 0)
        + sharedWords * 3
        + (candidate.featured ? 1 : 0);
      return { product: candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map(({ product: candidate }) => candidate);
}
