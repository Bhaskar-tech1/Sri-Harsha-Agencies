'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { id: 'nuts', label: 'Nuts' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'laddus-snacks', label: 'Laddus & Snacks' },
  { id: 'honey-items', label: 'Honey Items' },
  { id: 'dehydrated-fruits-veggies', label: 'Dehydrated Fruits & Veggies' },
  { id: 'berries', label: 'Berries' },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const fileInputRef = useRef(null);

  // Auth & Loading
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('product'); // 'product' | 'combo'
  const [category, setCategory] = useState('nuts');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);

  // Product variants (for type === 'product')
  const [variants, setVariants] = useState([
    { id: '250g', label: '250 g', mrp: '', salePrice: '' },
  ]);

  // Combo pricing (for type === 'combo')
  const [comboSalePrice, setComboSalePrice] = useState('');
  const [comboMrp, setComboMrp] = useState('');

  // Image Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    checkAuthAndLoad();
  }, [productId]);

  async function checkAuthAndLoad() {
    try {
      const authRes = await fetch('/api/admin/check');
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push('/admin/login');
        return;
      }

      if (!productId) return;

      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        setFormError('Product could not be found.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setName(data.name || '');
      setType(data.type || 'product');
      setCategory(data.category || 'nuts');
      setDescription(data.description || '');
      setIngredients(data.ingredients || '');
      setFeatured(data.featured === true);
      setInStock(data.inStock !== false);
      setImageUrl(data.image || '');

      if (data.type === 'combo') {
        setComboSalePrice(data.salePrice?.toString() || '');
        setComboMrp(data.mrp?.toString() || '');
      } else if (data.variants && data.variants.length > 0) {
        setVariants(
          data.variants.map((v) => ({
            id: v.id || v.label,
            label: v.label || '',
            salePrice: v.salePrice?.toString() || '',
            mrp: v.mrp?.toString() || '',
          }))
        );
      } else {
        setVariants([
          {
            id: 'standard',
            label: 'Standard',
            salePrice: data.salePrice?.toString() || '',
            mrp: data.mrp?.toString() || '',
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setFormError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate discount percentage
  function calculateDiscount(mrp, sale) {
    const numMrp = parseFloat(mrp);
    const numSale = parseFloat(sale);
    if (!numMrp || !numSale || numMrp <= numSale) return null;
    return Math.round(((numMrp - numSale) / numMrp) * 100);
  }

  // Variant operations
  function handleAddVariant() {
    setVariants((prev) => [
      ...prev,
      { id: `v-${Date.now()}`, label: '500 g', mrp: '', salePrice: '' },
    ]);
  }

  function handleUpdateVariant(index, field, value) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function handleRemoveVariant(index) {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle Cloudinary Image Upload
  async function handleImageFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.');
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Failed to upload image.');
        setUploadingImage(false);
        return;
      }

      setImageUrl(data.url);
    } catch {
      setUploadError('Network error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  }

  // Submit Update Handler
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }

    if (!imageUrl) {
      setFormError('Please upload a product image.');
      return;
    }

    let payload = {
      name: name.trim(),
      type,
      description: description.trim(),
      image: imageUrl,
      imageAlt: name.trim(),
      featured,
      inStock,
    };

    if (type === 'product') {
      if (variants.length === 0) {
        setFormError('Please add at least one variant.');
        return;
      }

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v.salePrice || isNaN(parseFloat(v.salePrice))) {
          setFormError(`Please enter a valid sale price for variant ${v.label || i + 1}.`);
          return;
        }
      }

      const formattedVariants = variants.map((v) => {
        const sale = parseFloat(v.salePrice);
        const mrpVal = v.mrp ? parseFloat(v.mrp) : sale;
        return {
          id: (v.label || 'standard').toLowerCase().replace(/\s+/g, ''),
          label: v.label || 'Standard',
          salePrice: sale,
          mrp: mrpVal,
          sku: `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${v.label || 'std'}`,
        };
      });

      payload.category = category;
      payload.ingredients = ingredients.trim() || undefined;
      payload.variants = formattedVariants;
      payload.salePrice = formattedVariants[0].salePrice;
      payload.mrp = formattedVariants[0].mrp;
    } else {
      // type === 'combo'
      const sale = parseFloat(comboSalePrice);
      const mrpVal = comboMrp ? parseFloat(comboMrp) : sale;

      if (!sale || isNaN(sale)) {
        setFormError('Please enter a valid sale price for the combo.');
        return;
      }

      payload.category = null;
      payload.salePrice = sale;
      payload.mrp = mrpVal;
      payload.variantLabel = 'Curated selection';
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setFormError(result.error || 'Failed to update product.');
        setSubmitting(false);
        return;
      }

      router.push('/admin');
    } catch {
      setFormError('An unexpected error occurred while saving.');
      setSubmitting(false);
    }
  }

  const comboDiscount = calculateDiscount(comboMrp, comboSalePrice);

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="admin-loading-screen">
          <div className="admin-spinner" />
          <p>Loading product details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-form-header">
        <Link href="/admin" className="admin-back-circle-btn" title="Back to dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <div className="admin-form-title-group">
          <h1 className="admin-form-page-title">Edit Product</h1>
          <p className="admin-form-page-subtitle">Update product information in the Sri Harsha Agencies database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid">
        {/* Left Column: Basic Details & Pricing */}
        <div className="admin-form-left-col">
          {/* Card: Basic Details */}
          <section className="admin-card">
            <h2 className="admin-card-title">Basic Details</h2>

            {/* Product Name */}
            <div className="admin-field">
              <label htmlFor="prod-name">Product Name *</label>
              <input
                id="prod-name"
                type="text"
                placeholder={type === 'combo' ? 'e.g. Everyday Nut Trio' : 'e.g. California Almonds'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Type Selector (Product vs Combo) */}
            <div className="admin-field">
              <label>Product Type *</label>
              <div className="admin-type-toggle-group">
                <button
                  type="button"
                  className={`admin-type-toggle-btn ${type === 'product' ? 'active' : ''}`}
                  onClick={() => setType('product')}
                >
                  Standard Product
                </button>
                <button
                  type="button"
                  className={`admin-type-toggle-btn ${type === 'combo' ? 'active' : ''}`}
                  onClick={() => setType('combo')}
                >
                  Curated Combo
                </button>
              </div>
            </div>

            {/* Category Dropdown (only for product type) */}
            {type === 'product' && (
              <div className="admin-field">
                <label htmlFor="prod-category">Category *</label>
                <select
                  id="prod-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div className="admin-field">
              <label htmlFor="prod-desc">Description *</label>
              <textarea
                id="prod-desc"
                rows={4}
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Ingredients (optional) */}
            {type === 'product' && (
              <div className="admin-field">
                <label htmlFor="prod-ingredients">Ingredients (comma separated)</label>
                <input
                  id="prod-ingredients"
                  type="text"
                  placeholder="e.g. Almonds, Rock Salt"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>
            )}
          </section>

          {/* Card: Pricing & Weights */}
          <section className="admin-card">
            <div className="admin-card-header-row">
              <h2 className="admin-card-title">Pricing & Weights</h2>
              {type === 'product' && (
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="admin-add-variant-btn"
                >
                  + Add Variant
                </button>
              )}
            </div>

            {type === 'product' ? (
              <div className="admin-variants-list">
                {variants.map((v, index) => {
                  const discount = calculateDiscount(v.mrp, v.salePrice);
                  return (
                    <div key={v.id || index} className="admin-variant-row">
                      <div className="admin-variant-col">
                        <label className="admin-variant-label">Weight / Volume</label>
                        <input
                          type="text"
                          placeholder="e.g. 250g, 1kg"
                          value={v.label}
                          onChange={(e) => handleUpdateVariant(index, 'label', e.target.value)}
                          required
                        />
                      </div>

                      <div className="admin-variant-col">
                        <label className="admin-variant-label">Sale Price (₹) *</label>
                        <input
                          type="number"
                          placeholder="₹ Sale"
                          value={v.salePrice}
                          onChange={(e) => handleUpdateVariant(index, 'salePrice', e.target.value)}
                          required
                          min="1"
                        />
                      </div>

                      <div className="admin-variant-col">
                        <label className="admin-variant-label">MRP (Optional)</label>
                        <input
                          type="number"
                          placeholder="₹ MRP"
                          value={v.mrp}
                          onChange={(e) => handleUpdateVariant(index, 'mrp', e.target.value)}
                          min="1"
                        />
                      </div>

                      {discount !== null && (
                        <div className="admin-variant-discount">
                          <span>-{discount}%</span>
                        </div>
                      )}

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="admin-variant-remove-btn"
                          title="Remove variant"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Combo pricing */
              <div className="admin-combo-pricing-grid">
                <div className="admin-field">
                  <label htmlFor="combo-sale">Sale Price (₹) *</label>
                  <input
                    id="combo-sale"
                    type="number"
                    placeholder="e.g. 990"
                    value={comboSalePrice}
                    onChange={(e) => setComboSalePrice(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="combo-mrp">MRP (₹)</label>
                  <input
                    id="combo-mrp"
                    type="number"
                    placeholder="e.g. 1150"
                    value={comboMrp}
                    onChange={(e) => setComboMrp(e.target.value)}
                    min="1"
                  />
                </div>
                {comboDiscount !== null && (
                  <div className="admin-combo-discount-badge">
                    <span>Discount: {comboDiscount}% OFF</span>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Image & Status */}
        <div className="admin-form-right-col">
          {/* Card: Product Image with Cloudinary Upload */}
          <section className="admin-card">
            <h2 className="admin-card-title">Product Image *</h2>

            <div
              className={`admin-upload-dropzone ${imageUrl ? 'has-image' : ''}`}
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden-file-input"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
              />

              {uploadingImage ? (
                <div className="admin-upload-loading">
                  <div className="admin-spinner" />
                  <p>Uploading to Cloudinary…</p>
                </div>
              ) : imageUrl ? (
                <div className="admin-upload-preview">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={220}
                    height={220}
                    className="admin-preview-img"
                  />
                  <div className="admin-preview-overlay">
                    <span>Click or drop to replace image</span>
                  </div>
                </div>
              ) : (
                <div className="admin-upload-placeholder">
                  <div className="admin-upload-icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p className="admin-upload-main-text">Click to upload image</p>
                  <p className="admin-upload-sub-text">PNG, JPG, WebP up to 5MB</p>
                </div>
              )}
            </div>

            {uploadError && <p className="admin-field-error">{uploadError}</p>}
          </section>

          {/* Card: Product Status */}
          <section className="admin-card">
            <h2 className="admin-card-title">Product Status</h2>

            <div className="admin-checkbox-list">
              <label className="admin-checkbox-item">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="admin-checkbox-label">Featured Product</span>
              </label>

              <label className="admin-checkbox-item">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span className="admin-checkbox-label">In Stock</span>
              </label>
            </div>
          </section>

          {formError && (
            <div className="admin-form-error-banner" role="alert">
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-submit-btn"
            disabled={submitting || uploadingImage}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{submitting ? 'Updating Product…' : 'Update Product in Database'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
