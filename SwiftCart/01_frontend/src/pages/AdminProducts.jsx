import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, ShieldCheck, LogOut,
  Package, Search, BarChart3, Users, ShoppingBag, TrendingUp,
} from 'lucide-react';
import { selectIsAdmin, selectUser, logout } from '../store/authSlice';
import { addProduct, updateProduct, deleteProduct, setProducts } from '../store/productSlice';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const BLANK_FORM = {
  name: '', description: '', price: '', category: 'Groceries',
  image: '', stockCount: '', aisle: '',
};
const CATEGORIES = [
  'Groceries', 'Vegetables', 'Fruits', 'Snacks', 'Chocolates',
  'Beverages', 'Dairy', 'Toys', 'Personal Care', 'Electronics',
  'Accessories', 'Home', 'Office', 'Beauty', 'Clothing', 'Sports', 'Health',
];

const AdminProducts = () => {
  const isAdmin  = useSelector(selectIsAdmin);
  const user     = useSelector(selectUser);
  const products = useSelector(state => state.products.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm]           = useState(BLANK_FORM);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [preview, setPreview]     = useState('');
  const [errors, setErrors]       = useState({});
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [saving, setSaving]       = useState(false);
  const [stats, setStats]         = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'stats'

  // Fetch real stats from backend
  useEffect(() => {
    if (!isAdmin) return;
    productService.getStats()
      .then(s => setStats(s))
      .catch(() => {}); // silently ignore if endpoint not ready
  }, [isAdmin, products.length]);

  // Redirect non-admins
  if (!isAdmin) {
    return (
      <div className="admin-access-denied glass-card animate-fade-in">
        <ShieldCheck size={48} color="#f43f5e" />
        <h2>Admin Access Only</h2>
        <p>You must be logged in as an admin to view this page.</p>
        <button className="btn-gradient" onClick={() => navigate('/login')}>
          Sign in as Admin
        </button>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim())                   e.name       = 'Product name is required';
    if (!form.price || isNaN(+form.price))   e.price      = 'Enter a valid price';
    if (!form.category)                      e.category   = 'Category is required';
    if (!form.stockCount || isNaN(+form.stockCount)) e.stockCount = 'Enter a valid stock count';
    return e;
  };

  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (field === 'image') setPreview(val);
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm(f => ({ ...f, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       +form.price,
      category:    form.category,
      image:       form.image.trim() || null,
      stockCount:  +form.stockCount,
      aisle:       form.aisle.trim() || null,
    };

    setSaving(true);
    try {
      if (editId) {
        // Update existing product via API
        const updated = await productService.updateProduct(editId, payload);
        dispatch(updateProduct(updated));
        toast.success('Product updated!');
      } else {
        // Create new product via API
        const created = await productService.createProduct(payload);
        dispatch(addProduct(created));
        toast.success('Product added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      name:        p.name,
      description: p.description || '',
      price:       String(p.price),
      category:    p.category,
      image:       p.image || '',
      stockCount:  String(p.stockCount ?? p.stock_count ?? 0),
      aisle:       p.aisle || '',
    });
    setPreview(p.image || '');
    setEditId(p._id ?? p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productService.deleteProduct(id);
      dispatch(deleteProduct(id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    }
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null);
    setErrors({}); setForm(BLANK_FORM); setPreview('');
  };

  const allCategories = ['All', ...CATEGORIES];
  const visible = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <ShieldCheck size={22} color="#a78bfa" />
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Logged in as <strong>{user?.name}</strong> · {user?.email}</p>
          </div>
        </div>
        <div className="admin-header-right">
          <button className="admin-logout-btn" onClick={() => { dispatch(logout()); navigate('/'); }}>
            <LogOut size={15} /> Logout
          </button>
          <button
            className="btn-gradient admin-add-btn"
            onClick={() => { setShowForm(true); setEditId(null); setForm(BLANK_FORM); setPreview(''); }}
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Stats Row (live from backend) ── */}
      <div className="admin-stats-row">
        <div className="admin-stat-card glass-card">
          <Package size={20} color="#a78bfa" />
          <span className="stat-num">{stats?.totalProducts ?? products.length}</span>
          <span className="stat-label">Total Products</span>
        </div>
        <div className="admin-stat-card glass-card">
          <ShoppingBag size={20} color="#34d399" />
          <span className="stat-num">{stats?.totalOrders ?? '—'}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="admin-stat-card glass-card">
          <Users size={20} color="#38bdf8" />
          <span className="stat-num">{stats?.totalUsers ?? '—'}</span>
          <span className="stat-label">Users</span>
        </div>
        <div className="admin-stat-card glass-card">
          <TrendingUp size={20} color="#fbbf24" />
          <span className="stat-num">
            {stats?.revenue !== undefined ? `₹${Number(stats.revenue).toLocaleString('en-IN')}` : '—'}
          </span>
          <span className="stat-label">Revenue</span>
        </div>
        <div className="admin-stat-card glass-card">
          <span className="stat-num" style={{ color: '#f87171' }}>{stats?.outOfStock ?? products.filter(p => (p.stockCount ?? 0) === 0).length}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="admin-form-card glass-card animate-fade-in">
          <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              {/* Image */}
              <div className="admin-form-img-col">
                <div className="admin-img-preview">
                  {preview
                    ? <img src={preview} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                    : <Package size={40} color="#475569" />}
                </div>
                <label className="admin-img-label">
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageFile} hidden />
                </label>
                <p className="admin-field-hint">or paste URL below</p>
                <input
                  className="input-glass"
                  placeholder="https://..."
                  value={form.image}
                  onChange={e => handleChange('image', e.target.value)}
                />
              </div>

              {/* Fields */}
              <div className="admin-form-fields">
                <div className="admin-field">
                  <label>Product Name *</label>
                  <input
                    className={`input-glass ${errors.name ? 'err' : ''}`}
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="e.g. Organic Almonds 500g"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea
                    className="input-glass admin-textarea"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Brief product description..."
                  />
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Price (₹) *</label>
                    <input
                      className={`input-glass ${errors.price ? 'err' : ''}`}
                      type="number" min="0" step="0.01"
                      value={form.price}
                      onChange={e => handleChange('price', e.target.value)}
                      placeholder="99"
                    />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>
                  <div className="admin-field">
                    <label>Stock Count *</label>
                    <input
                      className={`input-glass ${errors.stockCount ? 'err' : ''}`}
                      type="number" min="0"
                      value={form.stockCount}
                      onChange={e => handleChange('stockCount', e.target.value)}
                      placeholder="100"
                    />
                    {errors.stockCount && <span className="field-error">{errors.stockCount}</span>}
                  </div>
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Category *</label>
                    <select
                      className="input-glass admin-select"
                      value={form.category}
                      onChange={e => handleChange('category', e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                  </div>
                  <div className="admin-field">
                    <label>Aisle / Location</label>
                    <input
                      className="input-glass"
                      value={form.aisle}
                      onChange={e => handleChange('aisle', e.target.value)}
                      placeholder="e.g. A-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="btn-secondary" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn-gradient" disabled={saving}>
                {saving
                  ? <span className="login-spinner" />
                  : editId
                    ? <><Edit2 size={15} /> Update Product</>
                    : <><Plus size={15} /> Add Product</>
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Product List ── */}
      <div className="admin-products-section">
        <div className="admin-filters-row">
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              className="input-glass admin-search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-cat-filter">
            {allCategories.map(c => (
              <button
                key={c}
                className={`cat-filter-btn ${catFilter === c ? 'active' : ''}`}
                onClick={() => setCatFilter(c)}
              >{c}</button>
            ))}
          </div>
        </div>

        <h3 className="admin-section-title">
          <Package size={17} /> Products ({visible.length})
        </h3>

        {visible.length === 0 ? (
          <div className="admin-empty glass-card">
            <Package size={40} color="#334155" />
            <p>{products.length === 0 ? 'No products yet. Click "Add Product" to get started.' : 'No products match your filter.'}</p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {visible.map(p => {
              const pid = p._id ?? p.id;
              return (
                <div key={pid} className="admin-product-card glass-card">
                  <div className="apc-img-wrap">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="apc-img" onError={e => { e.target.style.display = 'none'; }} />
                      : <div className="apc-img-placeholder"><Package size={28} color="#334155" /></div>}
                    <span className="apc-cat-badge">{p.category}</span>
                  </div>
                  <div className="apc-body">
                    <h4 className="apc-name">{p.name}</h4>
                    <p className="apc-desc">{p.description || '—'}</p>
                    <div className="apc-meta-row">
                      <span className="apc-price">₹{(+p.price).toFixed(2)}</span>
                      <span className={`apc-stock ${(p.stockCount ?? p.stock_count ?? 0) > 0 ? 'in' : 'out'}`}>
                        {(p.stockCount ?? p.stock_count ?? 0) > 0
                          ? `${p.stockCount ?? p.stock_count} in stock`
                          : 'Out of stock'}
                      </span>
                    </div>
                    {p.aisle && <span className="apc-aisle">Aisle {p.aisle}</span>}
                  </div>
                  <div className="apc-actions">
                    <button className="apc-btn edit" onClick={() => startEdit(p)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="apc-btn del" onClick={() => handleDelete(pid)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
