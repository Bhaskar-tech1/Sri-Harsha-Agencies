import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StoreShell from '@/components/shared/StoreShell';
import ScrollAnimations from '@/components/shared/ScrollAnimations';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: { default: `${siteConfig.name} | Thoughtful pantry favourites`, template: `%s | ${siteConfig.name}` },
  description: `Explore nuts, dry fruits, seeds, snacks, honey and curated combinations from ${siteConfig.name}.`,
  icons: { icon: siteConfig.logo },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ScrollAnimations />
          <StoreShell>{children}</StoreShell>
        </CartProvider>
      </body>
    </html>
  );
}
