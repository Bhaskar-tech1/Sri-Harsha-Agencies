export const metadata = {
  title: 'Admin Portal | Sri Harsha Agencies',
  description: 'Manage products, stock status, and catalog for Sri Harsha Agencies.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-root-layout">{children}</div>;
}
