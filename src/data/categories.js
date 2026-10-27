import { categoryImages } from '@/data/images';

export const categories = [
  { id: 'nuts', label: 'Nuts', description: 'A little crunch for every day.', image: categoryImages.nuts, imageAlt: 'Almonds, cashews and pistachios in a ceramic bowl', tone: 'sage' },
  { id: 'dry-fruits', label: 'Dry Fruits', description: 'Naturally sweet pantry favourites.', image: categoryImages.dryFruits, imageAlt: 'Dates, figs, golden raisins and dried apricots in a bowl', tone: 'rose' },
  { id: 'seeds', label: 'Seeds', description: 'Small additions, lots of texture.', image: categoryImages.seeds, imageAlt: 'A mix of pumpkin, sunflower, flax, sesame and chia seeds', tone: 'gold' },
  { id: 'laddus-snacks', label: 'Laddus & Snacks', description: 'A familiar bite for sharing.', image: categoryImages.laddusSnacks, imageAlt: 'Indian dry fruit laddus made with dates, figs, nuts and seeds', tone: 'orange' },
  { id: 'honey-items', label: 'Honey Items', description: 'Golden pantry favourites.', image: categoryImages.honeyItems, imageAlt: 'Amber honey, honeycomb and a wooden honey dipper', tone: 'honey' },
  { id: 'dehydrated-fruits-veggies', label: 'Dehydrated Fruits & Veggies', description: 'Bright, easy-to-enjoy produce.', image: categoryImages.dehydratedProduce, imageAlt: 'Dried mango, banana chips, beetroot and carrot crisps', tone: 'mango' },
  { id: 'berries', label: 'Berries', description: 'Naturally sweet berry favourites.', image: categoryImages.berries, imageAlt: 'Dried cranberries, blueberries and goji berries in a bowl', tone: 'rose' },
];

export const homeCategories = [
  ...categories,
  { id: 'combos', label: 'Combos', description: 'Curated selections, together.', image: categoryImages.combos, imageAlt: 'A curated assortment of nuts, dried fruits, seeds, berries and honey', tone: 'navy', href: '/combos' },
];

export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));
