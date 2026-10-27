import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  const href = category.href || `/products?category=${category.id}`;
  return (
    <Link className={`category-card category-card--${category.tone || 'sage'}`} href={href} aria-label={`Browse ${category.label}`}>
      <span className="category-card__image-wrap">
        <Image src={category.image} alt={category.imageAlt} fill sizes="(max-width: 640px) 43vw, (max-width: 1024px) 28vw, 20vw" />
      </span>
      <span className="category-card__name">{category.label}</span>
      <span className="category-card__description">{category.description}</span>
    </Link>
  );
}
