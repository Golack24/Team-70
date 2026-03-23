import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Running Shoes Pro',
      sku: 'RSP-001',
      price: 129.99,
      variants: 5,
      stock: 45,
      status: 'active',
    },
    {
      id: 2,
      name: 'Athletic Jacket',
      sku: 'AJ-002',
      price: 89.99,
      variants: 3,
      stock: 28,
      status: 'active',
    },
    {
      id: 3,
      name: 'Training Shorts',
      sku: 'TS-003',
      price: 49.99,
      variants: 4,
      stock: 12,
      status: 'low_stock',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    description: '',
    variants: [],
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({ name: '', sku: '', price: '', description: '', variants: [] });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      description: '',
      variants: [],
    });
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...formData,
        variants: 1,
        stock: 0,
        status: 'draft',
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Product Management</h2>
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleAddProduct}
          >
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
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="admin-btn">
            <FiFilter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>£{product.price.toFixed(2)}</td>
                  <td>{product.variants}</td>
                  <td>{product.stock} units</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        product.status === 'active'
                          ? 'admin-badge-success'
                          : product.status === 'low_stock'
                          ? 'admin-badge-warning'
                          : 'admin-badge-info'
                      }`}
                    >
                      {product.status === 'low_stock' ? 'Low Stock' : product.status}
                    </span>
                  </td>
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
              ))}
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
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">SKU</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="E.g., PRD-001"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Price</label>
                <input
                  type="number"
                  className="admin-input"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Variants</label>
                <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>
                  Add product variants (Size, Color, etc.) - feature coming soon
                </p>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSaveProduct}
              >
                {selectedProduct ? 'Update' : 'Create'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
