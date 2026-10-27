'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main>{children}</main>
      {!isAdmin && <SiteFooter />}
    </>
  );
}
