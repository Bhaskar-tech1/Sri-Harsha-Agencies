'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, Package, Boxes, PackageOpen, X, RotateCw, PackageX, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/pricing';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'product' | 'combo'
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'inStock' | 'outOfStock'
  const [message, setMessage] = useState(null);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    try {
      const authRes = await fetch('/api/admin/check');
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push('/admin/login');
        return;
      }
      await loadProducts();
    } catch {
      router.push('/admin/login');
    }
  }

  async function loadProducts() {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (!res.ok) {
        setProducts([]);
        setLoadError(data.error || 'Could not load products.');
        return;
      }
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        setLoadError('The product service returned an invalid response.');
      }
    } catch {
      setProducts([]);
      setLoadError('Could not connect to the product service.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/admin/login');
    }
  }

  async function handleToggleStock(product) {
    setActionLoadingId(product.id);
    const newStock = !product.inStock;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStock }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, inStock: newStock } : p))
        );
        showMessage(`Updated stock for "${product.name}"`);
      } else {
        alert(data.error || 'Could not update stock status. Please try again.');
      }
    } catch {
      alert('Error updating stock status.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;

    setActionLoadingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        showMessage(`Deleted "${product.name}"`);
      } else {
        alert(data.error || 'Could not delete product. Please try again.');
      }
    } catch {
      alert('Error deleting product.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSeed() {
    const confirmed = window.confirm('This will add the default sample products to the catalog. Continue?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showMessage(`Successfully added ${data.count} products to the catalog!`);
        await loadProducts();
      } else {
        alert(data.error || 'Failed to seed products.');
      }
    } catch {
      alert('Error connecting to seed endpoint.');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  }

  // Calculate stats
  const totalCount = products.length;
  const productCount = products.filter((p) => p.type === 'product').length;
  const comboCount = products.filter((p) => p.type === 'combo').length;

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Stock filter
      if (stockFilter === 'inStock' && item.inStock === false) return false;
      if (stockFilter === 'outOfStock' && item.inStock !== false) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(query);
        const matchCategory = item.category?.toLowerCase().includes(query);
        const matchDescription = item.description?.toLowerCase().includes(query);
        return matchName || matchCategory || matchDescription;
      }

      return true;
    });
  }, [products, typeFilter, stockFilter, searchQuery]);

  // Helper to extract pricing info
  function getPriceDisplay(item) {
    if (item.type === 'combo') {
      const sale = item.salePrice || item.price || 0;
      const mrp = item.mrp || sale;
      const discount = mrp > sale ? Math.round(((mrp - sale) / mrp) * 100) : 0;
      const weightLabel = item.weight || (item.variants && item.variants[0]?.label) || '';
      return { sale, mrp, discount, isRange: false, weightLabel };
    }

    if (item.variants && item.variants.length > 0) {
      const first = item.variants[0];
      const sale = first.salePrice || first.price || 0;
      const mrp = first.mrp || sale;
      const discount = mrp > sale ? Math.round(((mrp - sale) / mrp) * 100) : 0;
      const weightLabel =
        item.variants.length === 1
          ? first.label || ''
          : `${item.variants.length} variants`;
      return {
        sale,
        mrp,
        discount,
        variantCount: item.variants.length,
        isRange: item.variants.length > 1,
        weightLabel,
      };
    }

    const sale = item.salePrice || item.price || 0;
    const mrp = item.mrp || sale;
    const discount = mrp > sale ? Math.round(((mrp - sale) / mrp) * 100) : 0;
    return { sale, mrp, discount, isRange: false, weightLabel: item.weight || '' };
  }

  return (
    <div className="admin-page-container">
      {/* Top Navigation Bar matching Image 2 */}
      <header className="admin-nav-bar">
        <div className="admin-nav-left">
          <div className="admin-brand">
            <Link href="/" className="admin-logo-circle" title="Go to storefront home" aria-label="Go to storefront home">
              <Image src="/images/sri-harsha-logo.png" alt="Sri Harsha Agencies" width={38} height={38} priority />
            </Link>
            <div className="admin-brand-text">
              <h1 className="admin-brand-title">Sri Harsha Agencies</h1>
              <span className="admin-brand-subtitle">ADMIN PORTAL</span>
            </div>
          </div>
        </div>

        <div className="admin-nav-right">
          <Link href="/admin/products/new" className="admin-primary-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Product</span>
          </Link>

          <button onClick={handleLogout} className="admin-logout-btn" title="Sign out of admin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="admin-main-content">
        {message && (
          <div className="admin-toast-message">
            <span>{message}</span>
          </div>
        )}

        {/* 3 Metric Summary Cards matching Image 2 */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-icon admin-stat-icon--total">
                <LayoutGrid size={18} strokeWidth={2.2} />
              </span>
              <span className="admin-stat-label">Total</span>
            </div>
            <span className="admin-stat-value">{totalCount}</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-icon admin-stat-icon--products">
                <Package size={18} strokeWidth={2.2} />
              </span>
              <span className="admin-stat-label">Products</span>
            </div>
            <span className="admin-stat-value">{productCount}</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-icon admin-stat-icon--combos">
                <Boxes size={18} strokeWidth={2.2} />
              </span>
              <span className="admin-stat-label">Combos</span>
            </div>
            <span className="admin-stat-value">{comboCount}</span>
          </div>
        </section>

        {/* Filter and Search Container matching Image 2 */}
        <section className="admin-filter-card">
          <div className="admin-search-wrapper">
            <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="admin-search-clear" aria-label="Clear search"><X size={16} /></button>
            )}
          </div>

          <div className="admin-pills-row">
            <span className="admin-pills-label">Filter:</span>
            
            {/* Type filters */}
            <button
              onClick={() => setTypeFilter('all')}
              className={`admin-pill ${typeFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('product')}
              className={`admin-pill ${typeFilter === 'product' ? 'active' : ''}`}
            >
              Products
            </button>
            <button
              onClick={() => setTypeFilter('combo')}
              className={`admin-pill ${typeFilter === 'combo' ? 'active' : ''}`}
            >
              Combos
            </button>

            <span className="admin-pills-divider" />

            {/* Stock filters */}
            <button
              onClick={() => setStockFilter('all')}
              className={`admin-pill ${stockFilter === 'all' ? 'active' : ''}`}
            >
              All Stock
            </button>
            <button
              onClick={() => setStockFilter('inStock')}
              className={`admin-pill ${stockFilter === 'inStock' ? 'active' : ''}`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter('outOfStock')}
              className={`admin-pill ${stockFilter === 'outOfStock' ? 'active' : ''}`}
            >
              Out of Stock
            </button>
          </div>
        </section>

        {/* Counter & Refresh Bar matching Image 2 */}
        <div className="admin-table-meta-bar">
          <span className="admin-meta-count">
            {loading ? (
              'Loading catalog...'
            ) : (
              <>
                Showing <strong>{filteredProducts.length}</strong> of <strong>{totalCount}</strong> products
              </>
            )}
          </span>
          <button
            onClick={loadProducts}
            className="admin-refresh-btn"
            title="Refresh products"
            disabled={loading}
          >
            <RotateCw size={14} className={loading ? 'admin-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Desktop Table Wrapper */}
        <section className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="th-product">Product</th>
                <th className="th-type">Type / Category</th>
                <th className="th-price">Price</th>
                <th className="th-stock">Stock Status</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="admin-table-loading">
                    <div className="admin-spinner" />
                    <span>Loading catalog...</span>
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty" role="alert">{loadError}</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon" aria-hidden="true"><PackageOpen size={30} strokeWidth={1.8} /></div>
                      <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                        No products added yet
                      </h3>
                      <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280' }}>
                        Your store currently has 0 products. Click the button below to add your first product.
                      </p>
                      <Link href="/admin/products/new" className="admin-primary-btn" style={{ display: 'inline-flex' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add Your First Product</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    <p>No products found matching your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const priceInfo = getPriceDisplay(item);
                  const isOperating = actionLoadingId === item.id;

                  return (
                    <tr key={item.id} className={isOperating ? 'admin-row-operating' : ''}>
                      {/* Product Thumbnail & Name */}
                      <td className="td-product">
                        <div className="admin-prod-cell">
                          <div className="admin-thumb-box">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.imageAlt || item.name}
                                width={48}
                                height={48}
                                className="admin-thumb-img"
                              />
                            ) : (
                              <div className="admin-thumb-placeholder" aria-hidden="true"><Package size={20} strokeWidth={1.8} /></div>
                            )}
                          </div>
                          <div className="admin-prod-info">
                            <span className="admin-brand-tag">SRI HARSHA</span>
                            <span className="admin-prod-name">{item.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type / Category */}
                      <td className="td-type">
                        <div className="admin-category-cell">
                          <span className={`admin-type-badge ${item.type === 'combo' ? 'type-combo' : 'type-product'}`}>
                            {item.type === 'combo' ? 'Combo' : 'Product'}
                          </span>
                          <span className="admin-category-sub">
                            {item.category ? item.category.replace(/-/g, ' ') : (item.type === 'combo' ? 'Curated Combo' : 'General')}
                          </span>
                        </div>
                      </td>

                      {/* Price / MRP / Discount */}
                      <td className="td-price">
                        <div className="admin-price-cell">
                          <span className="admin-price-sale">{formatCurrency(priceInfo.sale)}</span>
                          {priceInfo.mrp > priceInfo.sale && (
                            <span className="admin-price-mrp">{formatCurrency(priceInfo.mrp)}</span>
                          )}
                          {priceInfo.discount > 0 && (
                            <span className="admin-price-discount">-{priceInfo.discount}%</span>
                          )}
                        </div>
                        {priceInfo.variantCount > 1 && (
                          <span className="admin-variant-count">{priceInfo.variantCount} variants</span>
                        )}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="td-stock">
                        <span className={`admin-stock-badge ${item.inStock !== false ? 'stock-in' : 'stock-out'}`}>
                          {item.inStock !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="td-actions">
                        <div className="admin-actions-cell">
                          {/* Stock Toggle Button */}
                          <button
                            onClick={() => handleToggleStock(item)}
                            className="admin-action-btn btn-stock"
                            title={item.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}
                            disabled={isOperating}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/admin/products/${item.id}/edit`}
                            className="admin-action-btn btn-edit"
                            title="Edit Product"
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item)}
                            className="admin-action-btn btn-delete"
                            title="Delete Product"
                            disabled={isOperating}
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {/* Mobile Card List matching Image 2 Reference */}
        <section className="admin-mobile-card-list">
          {loading ? (
            <div className="admin-mob-loading">
              <div className="admin-spinner" />
              <span>Loading catalog...</span>
            </div>
          ) : loadError ? (
            <div className="admin-mob-empty" role="alert">
              <p>{loadError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-mob-empty">
              <div className="admin-empty-icon" aria-hidden="true">
                <PackageOpen size={30} strokeWidth={1.8} />
              </div>
              <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                No products added yet
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280' }}>
                Your store currently has 0 products.
              </p>
              <Link href="/admin/products/new" className="admin-primary-btn" style={{ display: 'inline-flex' }}>
                + Add Your First Product
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-mob-empty">
              <p>No products found matching your search or filters.</p>
            </div>
          ) : (
            filteredProducts.map((item) => {
              const priceInfo = getPriceDisplay(item);
              const isOperating = actionLoadingId === item.id;
              const categoryLabel = item.category
                ? item.category.replace(/-/g, ' ')
                : item.type === 'combo'
                ? 'Curated Combo'
                : 'General';

              return (
                <div
                  key={item.id}
                  className={`admin-mob-card-item ${isOperating ? 'operating' : ''}`}
                >
                  {/* Top: Thumbnail & Details */}
                  <div className="admin-mob-top">
                    <div className="admin-mob-thumb">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          width={70}
                          height={70}
                          className="admin-mob-img"
                        />
                      ) : (
                        <div className="admin-thumb-placeholder" aria-hidden="true">
                          <Package size={24} strokeWidth={1.8} />
                        </div>
                      )}
                    </div>

                    <div className="admin-mob-info">
                      {/* Badges: Type, Category, Featured */}
                      <div className="admin-mob-badges">
                        <span
                          className={`admin-mob-badge-type ${
                            item.type === 'combo' ? 'combo' : 'product'
                          }`}
                        >
                          {item.type === 'combo' ? 'Combo' : 'Product'}
                        </span>

                        <span className="admin-mob-badge-cat">{categoryLabel}</span>

                        {item.featured && (
                          <span className="admin-mob-badge-featured">Featured</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="admin-mob-title">{item.name}</h3>

                      {/* Price & Weight row */}
                      <div className="admin-mob-price-row">
                        <span className="admin-mob-sale-price">
                          {formatCurrency(priceInfo.sale)}
                        </span>
                        {priceInfo.mrp > priceInfo.sale && (
                          <span className="admin-mob-mrp-price">
                            {formatCurrency(priceInfo.mrp)}
                          </span>
                        )}
                        {priceInfo.discount > 0 && (
                          <span className="admin-mob-discount-tag">
                            -{priceInfo.discount}%
                          </span>
                        )}
                        {priceInfo.weightLabel && (
                          <span className="admin-mob-weight-info">
                            · {priceInfo.weightLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Subcategory / In Stock Pill & 3 Action Buttons */}
                  <div className="admin-mob-bottom">
                    <div className="admin-mob-bottom-left">
                      <span className="admin-mob-tag-pill">{categoryLabel}</span>

                      <span
                        className={`admin-mob-stock-pill ${
                          item.inStock !== false ? 'in-stock' : 'out-stock'
                        }`}
                      >
                        <span className="admin-mob-stock-dot">●</span>
                        <span>{item.inStock !== false ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                      </span>
                    </div>

                    <div className="admin-mob-actions">
                      {/* Toggle Stock Button */}
                      <button
                        onClick={() => handleToggleStock(item)}
                        className="admin-mob-action-btn btn-stock"
                        title={item.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}
                        disabled={isOperating}
                        aria-label="Toggle stock status"
                      >
                        <PackageX size={18} strokeWidth={1.8} />
                      </button>

                      {/* Edit Button */}
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        className="admin-mob-action-btn btn-edit"
                        title="Edit Product"
                        aria-label="Edit Product"
                      >
                        <Pencil size={18} strokeWidth={1.8} />
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item)}
                        className="admin-mob-action-btn btn-delete"
                        title="Delete Product"
                        disabled={isOperating}
                        aria-label="Delete Product"
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}



