import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, ShieldCheck, LogOut, Package, Search } from 'lucide-react';
import { selectIsAdmin, selectUser, logout } from '../store/authSlice';
import { addProduct, updateProduct, deleteProduct } from '../store/productSlice';
import './AdminProducts.css';

const generateId = () => `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const BLANK_FORM = { name: '', description: '', price: '', category: 'Groceries', image: '', stockCount: '', aisle: '' };
const CATEGORIES = ['Groceries', 'Vegetables', 'Fruits', 'Snacks', 'Chocolates', 'Beverages', 'Dairy', 'Toys', 'Personal Care', 'Electronics', 'Accessories', 'Home', 'Office'];

const AdminProducts = () => {
  const isAdmin  = useSelector(selectIsAdmin);
  const user     = useSelector(selectUser);
  const products = useSelector(state => state.products.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm]         = useState(BLANK_FORM);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview]   = useState('');
  const [errors, setErrors]     = useState({});
  const [search, setSearch]     = useState('');
  const [catFilter, setCatFilter] = useState('All');

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
    if (!form.name.trim())              e.name = 'Product name is required';
    if (!form.price || isNaN(+form.price)) e.price = 'Enter a valid price';
    if (!form.category)                 e.category = 'Category is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const stockCount = +form.stockCount || 0;
    if (editId) {
      dispatch(updateProduct({
        ...products.find(p => p._id === editId),
        ...form,
        price: +form.price,
        stockCount,
        inStock: stockCount > 0,
      }));
      setEditId(null);
    } else {
      dispatch(addProduct({
        _id: generateId(),
        ...form,
        price: +form.price,
        stockCount,
        inStock: stockCount > 0,
        createdAt: new Date().toISOString(),
      }));
    }
    setForm(BLANK_FORM);
    setPreview('');
    setShowForm(false);
    setErrors({});
  };

  const startEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: String(p.price), category: p.category, image: p.image || '', stockCount: String(p.stockCount), aisle: p.aisle || '' });
    setPreview(p.image || '');
    setEditId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      dispatch(deleteProduct(id));
    }
  };

  const closeForm = () => { setShowForm(false); setEditId(null); setErrors({}); setForm(BLANK_FORM); setPreview(''); };

  const allCategories = ['All', ...CATEGORIES];
  const visible = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      {/* Header */}
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
          <button className="btn-gradient admin-add-btn" onClick={() => { setShowForm(true); setEditId(null); setForm(BLANK_FORM); setPreview(''); }}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card glass-card">
          <span className="stat-num">{products.length}</span>
          <span className="stat-label">Total Products</span>
        </div>
        <div className="admin-stat-card glass-card">
          <span className="stat-num">{products.filter(p => p.stockCount > 0).length}</span>
          <span className="stat-label">In Stock</span>
        </div>
        <div className="admin-stat-card glass-card">
          <span className="stat-num" style={{ color: '#f87171' }}>{products.filter(p => p.stockCount === 0).length}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
        <div className="admin-stat-card glass-card">
          <span className="stat-num">{new Set(products.map(p => p.category)).size}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="admin-form-card glass-card animate-fade-in">
          <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              {/* Image */}
              <div className="admin-form-img-col">
                <div className="admin-img-preview">
                  {preview
                    ? <img src={preview} alt="preview" onError={e => { e.target.style.display='none'; }} />
                    : <Package size={40} color="#475569" />}
                </div>
                <label className="admin-img-label">
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageFile} hidden />
                </label>
                <p className="admin-field-hint">or paste URL below</p>
                <input className="input-glass" placeholder="https://..." value={form.image} onChange={e => handleChange('image', e.target.value)} />
              </div>

              {/* Fields */}
              <div className="admin-form-fields">
                <div className="admin-field">
                  <label>Product Name *</label>
                  <input className={`input-glass ${errors.name ? 'err' : ''}`} value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Organic Almonds 500g" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea className="input-glass admin-textarea" value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Brief product description..." />
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Price (₹) *</label>
                    <input className={`input-glass ${errors.price ? 'err' : ''}`} type="number" min="0" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="99" />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>
                  <div className="admin-field">
                    <label>Stock Count *</label>
                    <input className={`input-glass ${errors.stockCount ? 'err' : ''}`} type="number" min="0" value={form.stockCount} onChange={e => handleChange('stockCount', e.target.value)} placeholder="100" />
                    {errors.stockCount && <span className="field-error">{errors.stockCount}</span>}
                  </div>
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Category *</label>
                    <select className="input-glass admin-select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                  </div>
                  <div className="admin-field">
                    <label>Aisle / Location</label>
                    <input className="input-glass" value={form.aisle} onChange={e => handleChange('aisle', e.target.value)} placeholder="e.g. A-12" />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="btn-secondary" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn-gradient">
                {editId ? <><Edit2 size={15} /> Update Product</> : <><Plus size={15} /> Add Product</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
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
              <button key={c} className={`cat-filter-btn ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
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
            {visible.map(p => (
              <div key={p._id} className="admin-product-card glass-card">
                <div className="apc-img-wrap">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="apc-img" onError={e => { e.target.style.display='none'; }} />
                    : <div className="apc-img-placeholder"><Package size={28} color="#334155" /></div>}
                  <span className="apc-cat-badge">{p.category}</span>
                </div>
                <div className="apc-body">
                  <h4 className="apc-name">{p.name}</h4>
                  <p className="apc-desc">{p.description || '—'}</p>
                  <div className="apc-meta-row">
                    <span className="apc-price">₹{(+p.price).toFixed(2)}</span>
                    <span className={`apc-stock ${p.stockCount > 0 ? 'in' : 'out'}`}>
                      {p.stockCount > 0 ? `${p.stockCount} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  {p.aisle && <span className="apc-aisle">Aisle {p.aisle}</span>}
                </div>
                <div className="apc-actions">
                  <button className="apc-btn edit" onClick={() => startEdit(p)} title="Edit"><Edit2 size={14} /></button>
                  <button className="apc-btn del" onClick={() => handleDelete(p._id)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
