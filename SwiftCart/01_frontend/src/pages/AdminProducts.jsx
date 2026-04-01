import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, ShieldCheck, LogOut, Package } from 'lucide-react';
import { selectIsAdmin, selectUser, logout } from '../store/authSlice';
import { useCart } from '../hooks/useCart';
import './AdminProducts.css';

// Local product store for admin (persisted in state)
const generateId = () => `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const BLANK_FORM = { name: '', description: '', price: '', category: 'Electronics', image: '', stockCount: '', aisle: '' };
const CATEGORIES = ['Electronics', 'Groceries', 'Apparel', 'Accessories', 'Home', 'Office'];

const AdminProducts = () => {
  const isAdmin  = useSelector(selectIsAdmin);
  const user     = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(BLANK_FORM);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [preview, setPreview]     = useState('');
  const [errors, setErrors]       = useState({});

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
    if (!form.name.trim())        e.name = 'Product name is required';
    if (!form.price || isNaN(+form.price)) e.price = 'Enter a valid price';
    if (!form.category)           e.category = 'Category is required';
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

    if (editId) {
      setProducts(ps => ps.map(p => p._id === editId ? { ...p, ...form, price: +form.price, stockCount: +form.stockCount || 0 } : p));
      setEditId(null);
    } else {
      setProducts(ps => [...ps, {
        _id: generateId(),
        ...form,
        price: +form.price,
        stockCount: +form.stockCount || 0,
        createdAt: new Date().toISOString(),
      }]);
    }
    setForm(BLANK_FORM);
    setPreview('');
    setShowForm(false);
  };

  const startEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, image: p.image || '', stockCount: String(p.stockCount), aisle: p.aisle || '' });
    setPreview(p.image || '');
    setEditId(p._id);
    setShowForm(true);
  };

  const deleteProduct = (id) => setProducts(ps => ps.filter(p => p._id !== id));

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
                    ? <img src={preview} alt="preview" />
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
                  <input className={`input-glass ${errors.name ? 'err' : ''}`} value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Wireless Headphones" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea className="input-glass admin-textarea" value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Product description..." />
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Price (₹) *</label>
                    <input className={`input-glass ${errors.price ? 'err' : ''}`} type="number" min="0" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="999" />
                    {errors.price && <span className="field-error">{errors.price}</span>}
                  </div>
                  <div className="admin-field">
                    <label>Stock Count</label>
                    <input className="input-glass" type="number" min="0" value={form.stockCount} onChange={e => handleChange('stockCount', e.target.value)} placeholder="100" />
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
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); setErrors({}); }}>
                Cancel
              </button>
              <button type="submit" className="btn-gradient">
                {editId ? <><Edit2 size={15} /> Update Product</> : <><Plus size={15} /> Add Product</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      <div className="admin-products-section">
        <h3 className="admin-section-title">
          <Package size={17} /> Products ({products.length})
        </h3>

        {products.length === 0 ? (
          <div className="admin-empty glass-card">
            <Package size={40} color="#334155" />
            <p>No products yet. Click "Add Product" to get started.</p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {products.map(p => (
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
                  <button className="apc-btn edit" onClick={() => startEdit(p)}><Edit2 size={14} /></button>
                  <button className="apc-btn del" onClick={() => deleteProduct(p._id)}><Trash2 size={14} /></button>
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
