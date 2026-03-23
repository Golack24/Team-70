import React, { useMemo, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { createProduct, updateProduct, deleteProduct } from '../api';

export default function AdminProducts({ products = [], refreshData }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    category_id: '',
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      category_id: '',
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      image: product.image || '',
      category_id: product.category_id ?? '',
    });
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock || 0),
        description: formData.description || null,
        image: formData.image || null,
        category_id: formData.category_id === '' ? null : Number(formData.category_id),
      };

      if (!payload.name || Number.isNaN(payload.price)) {
        alert('Name and valid price are required');
        return;
      }

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      await refreshData?.();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      await refreshData?.();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      String(p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Product Management</h2>
          <button className="admin-btn admin-btn-primary" onClick={handleAddProduct}>
            <FiPlus size={18} /> Add Product
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch
              size={18}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="admin-input"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>£{Number(product.price || 0).toFixed(2)}</td>
                    <td>{product.stock ?? 0}</td>
                    <td>{product.category_name || 'Uncategorised'}</td>
                    <td>{product.image ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className="admin-table-action"
                        onClick={() => handleEditProduct(product)}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="admin-table-action danger"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {selectedProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Product Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Price</label>
                <input
                  type="number"
                  className="admin-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Stock</label>
                <input
                  type="number"
                  className="admin-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Image URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category ID</label>
                <input
                  type="number"
                  className="admin-input"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSaveProduct}
                disabled={saving}
              >
                {saving ? 'Saving...' : selectedProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}